import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

const PageAvatar = ({ url }) => {
  return (
    <View>
      <Image
        style={styles.avatar}
        source={{
          uri: url,
        }}
      />
    </View>
  );
};

PageAvatar.propTypes = {
  url: PropTypes.string,
};

PageAvatar.defaultProps = {
  url: '',
};

export default PageAvatar;

const styles = StyleSheet.create({
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
