import Icon from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { logAction } from '../../../constants/chat';
import { diffTimeInMinutes, formatDate } from '../../../utils';

import MessageAvatar from '../MessageAvatar';
import MessageBubble from '../MessageBubble';
import MessageText from '../MessageText';
import MessageAttachments from '../MessageAttachments';

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
      avatar: roomInfo?.customFields?.dataInfoDto?.profilePic ?? 'livechat',
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
      {data?.messageReply && data?.msg && (
        <View
          style={[
            styles.replyHeader,
            data?.me && styles.replyHeaderReverse,
            !data?.me && { marginLeft: 40 },
          ]}>
          <View style={styles.replyInner}>
            <Icon
              name="reply"
              size={16}
              color="#282525"
              // style={styles.replyIcon}
            />
            <Text>{` ${data?.me ? 'Bạn' : data?.senderName} đã trả lời `}</Text>
            <Text style={styles.replyName}>
              {data?.me &&
              data?.messageReply?.senderName === currentUser?.username
                ? 'Chính mình'
                : !data?.me &&
                  data?.messageReply?.senderName === currentUser?.username
                ? 'Bạn'
                : data?.messageReply?.senderName}
            </Text>
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageContainer,
          !data?.me && styles.messageContainerReverse,
          !data?.me && !data?.showAvatar && { marginLeft: 40 },
        ]}>
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

        <View style={styles.messageContent}>
          {data?.msg && data?.messageReply ? (
            <View key={data?.mid}>
              {data?.messageReply?.attachments &&
              data?.messageReply?.attachments.length > 0 &&
              (data?.messageReply?.attachments[0]?.type === 'image' ||
                data?.messageReply?.attachments[0]?.type === 'gif' ||
                data?.messageReply?.attachments[0]?.type === 'sticker') ? (
                // Reply ảnh bằng text
                // <MessageBubble
                //   reply={true}
                //   position={position}
                //   isImage
                //   nude
                //   ts={ts}
                //   inverse={me}
                //   quoted={quoted}
                //   other={!customer && !me}>
                //   <GridImages
                //     mid={mid}
                //     images={messageReply?.attachments}
                //     onLoad={onLoadAttachment}
                //     scrollIntoReply={() => handleScrollToReply(messageReply?.mid)}
                //   />
                // </MessageBubble>
                <MessageAttachments
                  attachments={data?.messageReply?.attachments}
                  id={data?.senderId}
                  isMe={data?.me}
                />
              ) : (
                // Reply text bằng text
                <MessageBubble
                  // ts={ts}
                  reply={true}
                  replyCustomer={data?.customer}
                  inverse={data?.me}
                  quoted={data?.quoted}
                  other={!data?.customer && !data?.me}
                  position={data?.position}
                  style={{
                    backgroundColor: '#fff',
                  }}
                  // onClick={() => handleScrollToReply(messageReply?.mid)}
                >
                  <MessageText
                    reply={true}
                    text={data?.messageReply?.text || 'Tệp đính kèm'}
                    customer={data?.customer}
                    system={data?.system}
                    inverse={data?.me}
                    other={!data?.customer && !data?.me}
                    style={{ opacity: 0.45, color: '#000', fontSize: 12 }}
                  />
                </MessageBubble>
              )}
              <View>
                <MessageBubble
                  ts={data?.ts}
                  inverse={data?.me}
                  quoted={data?.quoted}
                  other={!data?.customer && !data?.me}
                  position={data?.position}
                  style={{ marginTop: -8 }}>
                  <MessageText
                    mid={data?.mid}
                    customer={data?.customer}
                    text={data?.msg}
                    system={data?.system}
                    inverse={data?.me}
                    other={!data?.customer && !data?.me}
                  />
                </MessageBubble>
                {/* {(roomInfo?.type === 'LIVECHAT' || roomInfo?.type === 'ZALO') && (
              <div
                className={classNames(styles['reply-message-icon'], {
                  [styles['reply-message-icon__reverse']]: !me,
                })}
                hidden={hideReply}>
                <Tooltip title="Trả lời">
                  <Button
                    id={`reply-button-${mid}`}
                    className={styles['reply-button']}
                    icon={<Icon component={IconReply} />}
                    onClick={handleClickReply}
                  />
                </Tooltip>
              </div>
            )} */}
              </View>
            </View>
          ) : data?.message?.attachments?.length > 0 ? (
            <MessageAttachments
              attachments={data?.message?.attachments}
              id={data?.senderId}
              isMe={data?.me}
            />
          ) : (
            <MessageBubble
              key={data?.mid}
              ts={data?.ts}
              inverse={data?.me}
              quoted={data?.quoted}
              other={!data?.customer && !data?.me}
              position={data?.position}>
              <MessageText
                mid={data?.mid}
                customer={data?.customer}
                text={data?.msg}
                system={data?.system}
                inverse={data?.me}
                other={!data?.customer && !data?.me}
              />
            </MessageBubble>
          )}
        </View>
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
  replyHeader: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  replyHeaderReverse: {
    flexDirection: 'row-reverse',
  },
  replyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyIcon: {
    transform: [{ rotateY: '180deg' }],
  },
  replyName: { fontWeight: 'bold' },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageContainerReverse: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    marginLeft: 5,
    maxWidth: '75%',
  },
});
