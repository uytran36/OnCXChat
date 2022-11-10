import { StyleSheet, View } from 'react-native';
import Loading from '../Loading';

const LoadingOverlay = () => {
  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
  },
});
