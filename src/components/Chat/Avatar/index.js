import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';

import { iconAssets } from '../../../../assets/icons/iconAssets';

const Avatar = ({ url, type, name }) => {
  return (
    <View>
      {url ? (
        <Image
          style={styles.avatar}
          source={{
            uri: url,
          }}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            styles.nameContainer,
            {
              backgroundColor: `#${Math.floor(
                name.charCodeAt(0) * 50000,
              ).toString(16)}`,
            },
          ]}>
          <Text style={styles.nameAvatar}>
            {name?.split(' ')[0].length < 8
              ? name?.split(' ')[0]
              : name?.split(' ')[0].slice(0, 8)}
          </Text>
        </View>
      )}
      <Image style={styles.channel} source={iconAssets[type]} />
    </View>
  );
};

Avatar.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
};

Avatar.defaultProps = {
  url: '',
  type: '',
  name: '',
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  channel: {
    position: 'absolute',
    right: 8,
    bottom: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAvatar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
