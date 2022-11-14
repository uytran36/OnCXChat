import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const MessageAvatar = ({ avatar: avatarProp, roomName, senderId }) => {
  const { userCareRooms } = useSelector(state => state.chat.roomInfo);

  const avatar = useMemo(() => {
    if (avatarProp === 'livechat') {
      const user = userCareRooms?.find(item => item.id === senderId);
      return user?.avatarUrl ?? 'livechat';
    }
    return avatarProp;
  }, [avatarProp, senderId, userCareRooms]);

  return (
    <View style={styles.container}>
      {avatar !== '' ? (
        avatar === 'livechat' ? (
          <View
            style={[
              styles.avatar,
              styles.nameContainer,
              {
                backgroundColor: `#${Math.floor(
                  roomName.charCodeAt(0) * 50000,
                ).toString(16)}`,
              },
            ]}>
            <Text style={styles.nameAvatar}>
              {roomName?.split(' ')[0].length < 8
                ? roomName?.split(' ')[0]
                : roomName?.split(' ')[0].slice(0, 8)}
            </Text>
          </View>
        ) : (
          <Image
            style={styles.avatar}
            source={{
              uri: avatar,
            }}
          />
        )
      ) : (
        <View
          style={[
            styles.avatar,
            styles.nameContainer,
            {
              backgroundColor: `#${Math.floor(
                '?'.charCodeAt(0) * 50000,
              ).toString(16)}`,
            },
          ]}>
          <Text style={styles.nameAvatar}>?</Text>
        </View>
      )}
    </View>
  );
};

MessageAvatar.propTypes = {
  avatar: PropTypes.string,
  roomName: PropTypes.string,
  senderId: PropTypes.string,
};

MessageAvatar.defaultProps = {
  avatar: '',
  roomName: '',
  senderId: '',
};

export default MessageAvatar;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAvatar: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
