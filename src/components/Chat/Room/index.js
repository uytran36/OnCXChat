import { Entypo } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { capitalizeFirstLetter, convertTimeToDate } from '../../../utils';
import styles from './styles';

import Avatar from '../Avatar';
import PageAvatar from '../PageAvatar';

const Room = ({ info, onAcceptRoom, onClickRoom }) => {
  const user = useSelector(state => state.user);
  const filter = useSelector(state => state.chat.filter);

  const data = useMemo(() => {
    const timeConvention = info?.lastMessage?.timestamp
      ? convertTimeToDate(info.lastMessage?.timestamp)
      : info.actionRoomDtos?.length > 0
      ? convertTimeToDate(info?.actionRoomDtos[0]?.timestamp)
      : convertTimeToDate(info?.createdDate);

    let renderLastMsg;
    if (
      Array.isArray(info?.lastMessage?.attachments) &&
      info?.lastMessage?.attachments.length > 0
    ) {
      renderLastMsg = `[${
        info?.lastMessage?.attachments[0]?.type === 'image'
          ? 'Hình ảnh'
          : capitalizeFirstLetter(info?.lastMessage?.attachments[0]?.type)
      }]`;
    } else {
      renderLastMsg = info?.lastMessage?.text;
    }

    return {
      ...info,
      url: info?.customFields?.dataInfoDto?.profilePic,
      timeConvention,
      lastMessage: {
        message: renderLastMsg,
        sender:
          info?.lastMessage?.senderId === info?.customFields?.dataInfoDto?.id
            ? ''
            : info?.lastMessage?.senderName === user?.currentUser?.username
            ? 'Bạn: '
            : `${info?.lastMessage?.senderName}: `,
      },
      liveChatClose: info?.livechatSession?.liveChatClose ?? false,
    };
  }, [info, user]);

  const handlePress = () => {
    if (filter?.status === 'RECEIVED') {
      onClickRoom(
        data.id,
        data.roomName,
        !!data.messageNumberUnread,
        data.agent,
      );
    }
  };

  return (
    <Pressable
      android_ripple={{ color: '#cccccc' }}
      style={({ pressed }) => [
        styles.room,
        pressed && Platform.OS === 'ios' && styles.roomPressed,
      ]}
      onPress={handlePress}>
      <View style={styles.avatarContainer}>
        <Avatar url={data?.url} type={data?.type} name={data?.roomName} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.innerTilteContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {data?.roomName ?? ''}
            </Text>
            <View
              style={[
                styles.status,
                data?.liveChatClose && styles.offline,
              ]}></View>
          </View>
          <Text style={styles.time}>{data?.timeConvention}</Text>
        </View>
        {data?.pageInfo?.pageName && (
          <View style={styles.pageContainer}>
            <PageAvatar url={data.pageInfo.avatarUrl} />
            <Text style={styles.pageName} numberOfLines={1}>
              {data.pageInfo.pageName}
            </Text>
          </View>
        )}
        <View style={styles.messageContainer}>
          {data?.forward?.status && (
            <Entypo name="forward" size={16} color="black" />
          )}
          <Text
            style={[
              styles.message,
              !data?.messageRead && styles.unReadMessage,
              data?.messageNumberUnread > 0 &&
                Number.isFinite(data.messageNumberUnread) &&
                styles.shorterMessage,
            ]}
            numberOfLines={1}>
            {data.lastMessage.sender}
            {data.lastMessage.message}
          </Text>
          {data?.messageNumberUnread > 0 &&
            Number.isFinite(data.messageNumberUnread) && (
              <View style={styles.numberUnReadContainer}>
                <Text style={styles.numberUnRead}>
                  {data.messageNumberUnread}
                </Text>
              </View>
            )}
        </View>
        {filter?.status !== 'RECEIVED' && (
          <View style={styles.buttonContainer}>
            {data?.forward?.status ? (
              <>
                {/* <Pressable
                  android_ripple={{ color: '#cccccc' }}
                  style={pressed => [
                    styles.acceptForwardBtn,
                    pressed && Platform.OS === 'ios' && styles.btnPressed,
                  ]}>
                  <Text style={styles.acceptForwardText}>Chấp nhận</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: '#cccccc' }}
                  style={pressed => [
                    styles.denyForwardBtn,
                    pressed && Platform.OS === 'ios' && styles.btnPressed,
                  ]}>
                  <Text style={styles.denyForwardText}>Từ chối</Text>
                </Pressable> */}
              </>
            ) : (
              <Pressable
                android_ripple={{ color: '#cccccc' }}
                style={pressed => [
                  styles.acceptBtn,
                  pressed && Platform.OS === 'ios' && styles.btnPressed,
                ]}
                onPress={() => onAcceptRoom(data.id, data.roomName)}>
                <Text style={styles.acceptText}>Chấp nhận</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

Room.propTypes = {
  info: PropTypes.object,
  onAcceptRoom: PropTypes.func,
  onClickRoom: PropTypes.func,
};

Room.defaultProps = {
  info: {},
  onAcceptRoom: () => null,
  onClickRoom: () => null,
};

export default memo(Room);
