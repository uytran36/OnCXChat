import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { logAction } from '../../../constants/chat';
import { diffTimeInMinutes, formatDate } from '../../../utils';

import MessageAvatar from '../MessageAvatar';

const Message = ({ messageInfo }) => {
  const { message, index, listMessage } = messageInfo;

  const { currentUser } = useSelector(state => state.user);
  const { roomInfo } = useSelector(state => state.chat);

  const data = useMemo(() => {
    const checkpoint =
      index === listMessage?.length - 1 ||
      diffTimeInMinutes(
        listMessage[index + 1]?.timestamp,
        message?.timestamp,
      ) >= 15;

    const showAvatar =
      checkpoint ||
      listMessage[index + 1]?.senderId !== message?.senderId ||
      listMessage[index + 1]?.messageReply ||
      message?.messageReply;

    const files = [];
    const videos = [];
    const images = [];
    const record = [];
    const voice = [];

    // Thứ tự ưu tiên khi render attachment: File, Video, Image
    Array.isArray(message?.attachments) &&
      message?.attachments?.forEach(attachment => {
        // images
        if (['gif', 'image', 'sticker'].includes(attachment.type)) {
          images.push(attachment);
          return null;
        }
        if (attachment.type === 'video') {
          videos.push(attachment);
          return null;
        }
        if (['file'].includes(attachment.type)) {
          files.push(attachment);
          return null;
        }
        if (['audio/mp4', 'voice', 'audio/mpeg'].includes(attachment.type)) {
          voice.push(attachment);
          return null;
        }
        if (/audio*/.test(attachment.type) && attachment.type !== 'audio/mp4') {
          record.push(attachment);
          return null;
        }
      });

    return {
      me: currentUser?.id === message?.senderId,
      roomName: roomInfo?.roomName ?? '',
      customer: roomInfo.customFields?.dataInfoDto?.id === message?.senderId,
      mid: message?.mid,
      senderId: message?.senderId,
      senderName: message?.senderName,
      avatar: roomInfo?.avatarURL ?? 'livechat',
      checkpoint,
      showAvatar,
      ts: message?.timestamp,
      msg: message?.text,
      attachments: [...files, ...videos],
      record: [...record],
      voice: [...voice],
      images,
      actionMessage: message?.actionRoomDtos,
      messageReply: message?.messageReply,
      message,
    };
  }, [message, index, listMessage]);

  const renderAction = (actionMessage, acpArray) => {
    return (
      Array.isArray(actionMessage) &&
      actionMessage.length > 0 &&
      actionMessage
        .map(item => {
          if (acpArray.includes(item?.type)) {
            return (
              <View
                key={'time' + item?.timestamp}
                style={styles.actionContainer}>
                <Text style={styles.timestamp}>
                  {formatDate(new Date(item?.timestamp))}
                </Text>
                <View style={styles.actionMessage}>
                  <Text style={styles.textHighlight}>
                    {item.from === currentUser?.username
                      ? 'Bạn'
                      : item.from
                      ? item.from
                      : item?.type === 'LIVECHAT_CLOSED'
                      ? 'Khách hàng'
                      : 'Unknown'}
                  </Text>
                  <Text>
                    {' '}
                    {logAction[item?.type].text}{' '}
                    {item.to && logAction[item?.type].bonus}{' '}
                  </Text>
                  {item.to && (
                    <Text style={styles.textHighlight}>
                      {item.to === currentUser?.username ? 'bạn' : item.to}
                    </Text>
                  )}
                </View>
              </View>
            );
          }
        })
        .filter(Boolean)
    );
  };

  const renderMiddleTime = (showMiddleTime, ts) => {
    return (
      showMiddleTime && (
        <View key={'time' + ts}>
          <Text style={styles.timestamp}>{formatDate(new Date(ts))}</Text>
        </View>
      )
    );
  };

  const renderContent = () => {};

  return (
    <View style={styles.container}>
      {renderAction(data?.actionMessage, ['ALL_CHAT'])}
      {renderMiddleTime(data?.checkpoint, data?.ts)}
      {!data?.messageReply &&
        !data?.customer &&
        data?.showAvatar &&
        !data?.me && (
          <Text style={styles.adminSender}>{data?.senderName ?? ''}</Text>
        )}
      <View style={styles.messageContainer}>
        {data?.showAvatar && !data?.me && data?.customer && (
          <MessageAvatar avatar={data?.avatar} roomName={data?.roomName} />
        )}
        {data?.showAvatar && !data?.me && !data?.customer && (
          <MessageAvatar
            avatar={'livechat'}
            roomName={data?.senderName}
            senderId={data?.senderId}
          />
        )}
        <View style={styles.messageContent}>{renderContent()}</View>
      </View>
      {renderAction(
        data?.actionMessage,
        Object.keys(logAction).filter(x => x !== 'ALL_CHAT'),
      )}
    </View>
  );
};

Message.propTypes = {
  messageInfo: PropTypes.shape({
    message: PropTypes.object,
    index: PropTypes.number,
    listMessage: PropTypes.array,
  }),
};

Message.defaultProps = {
  messageInfo: {
    message: {},
    index: 0,
    listMessage: [],
  },
};

export default memo(Message);

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  actionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestamp: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textHighlight: {
    color: '#127ace',
  },
  actionMessage: {
    flexDirection: 'row',
  },
  adminSender: {
    color: '#127ace',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 40,
  },
});
