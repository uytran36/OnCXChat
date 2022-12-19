import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useHeaders, useStompSocket } from '../../contexts';
import { requestGetRoomInfo } from '../../services/chat';
import { saveState, updateUserCareRooms } from '../../store/chat';
import { useMutationChat } from './Hooks/useChat';

import Action from './Action';
import Messages from './Messages';

const DetailChat = ({ roomId }) => {
  const [actionHeight, setActionHeight] = useState(0);

  const headers = useHeaders();

  const dispatch = useDispatch();

  const StompSocket = useStompSocket();

  const {
    onRefetchListMessage,
    onAppendLogAction,
    sendMessageWithAttachments: {
      onSendMessage: onSendMessageWithAttachments,
      loading: isSendingMessageWithAttachments,
    },
  } = useMutationChat(headers, {
    roomId,
  });

  const getRoomInfo = useCallback(async () => {
    const res = await requestGetRoomInfo(headers, { roomId });
    if (res?.status === 200) {
      dispatch(saveState({ roomInfo: res.data.response.data }));
    }
  }, [roomId]);

  useEffect(() => {
    getRoomInfo();
  }, [getRoomInfo]);

  useEffect(() => {
    const subscription = StompSocket.onWatchMessages(
      event => {
        onRefetchListMessage();
        if (event.eventType === 'NEW_MESSAGE') {
          const { avatarUrl, userId } = event;
          userId && dispatch(updateUserCareRooms({ avatarUrl, userId }));
        }
      },
      {
        roomId,
      },
    );

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe({
          roomId,
        });
      }
    };
  }, [StompSocket, roomId, onRefetchListMessage, dispatch]);

  useEffect(() => {
    const subscription3 = StompSocket.onWatchLogAction(
      event => {
        onAppendLogAction(event);
      },
      { roomId },
    );

    return () => {
      if (subscription3?.unsubscribe) {
        subscription3.unsubscribe({ roomId });
      }
    };
  }, [StompSocket, dispatch, onAppendLogAction, roomId]);

  const handleChangeActionHeight = useCallback((height = 0) => {
    setActionHeight(height);
  }, []);

  const handleSendMessage = useCallback(async text => {
    if (!text) return;
    const formData = new FormData();
    formData.append('typeMessage', 'text');
    formData.append('roomId', roomId);
    formData.append('text', text);

    const sended = await onSendMessageWithAttachments(formData);
    if (!sended) {
      Alert.alert('Lỗi hệ thống vui lòng gửi lại tin nhắn.');
    }

    return sended;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.MessagesContainer}>
        <Messages roomId={roomId} />
      </View>
      <View
        style={[
          styles.ActionContainer,
          { height: Math.max(35, actionHeight) },
        ]}>
        <Action
          loading={isSendingMessageWithAttachments}
          onChangeActionHeight={handleChangeActionHeight}
          onSendMessage={handleSendMessage}
          roomId={roomId}
          headers={headers}
        />
      </View>
    </View>
  );
};

DetailChat.propTypes = {
  roomId: PropTypes.string,
};

DetailChat.defaultProps = {
  roomId: '',
};

export default DetailChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  MessagesContainer: {
    flex: 1,
    paddingBottom: 8,
  },
  ActionContainer: {
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
