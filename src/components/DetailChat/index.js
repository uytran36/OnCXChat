import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useHeaders } from '../../contexts';
import { requestGetRoomInfo } from '../../services/chat';
import { saveState } from '../../store/chat';

import Action from './Action';
import Messages from './Messages';

const DetailChat = ({ roomId }) => {
  const headers = useHeaders();

  const dispatch = useDispatch();

  const getRoomInfo = useCallback(async () => {
    const res = await requestGetRoomInfo(headers, { roomId });
    if (res?.status === 200) {
      dispatch(saveState({ roomInfo: res.data.response.data }));
    }
  }, [roomId]);

  useEffect(() => {
    getRoomInfo();
  }, [getRoomInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.MessagesContainer}>
        <Messages roomId={roomId} />
      </View>
      <View style={styles.ActionContainer}>
        <Action />
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
    flex: 0.95,
  },
  ActionContainer: {
    flex: 0.05,
  },
});
