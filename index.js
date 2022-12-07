/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';
import { navigate } from './src/utils/rootNavigation';

PushNotification.configure({
  onNotification: function ({ data }) {
    if (data?.status === 'WAITING') {
      navigate('Chat');
    } else if (data?.status === 'PROCESSING') {
      navigate('DetailChat', { roomId: data?.id, roomName: data?.roomName });
    }
  },
  requestPermissions: Platform.OS === 'ios',
});

AppRegistry.registerComponent(appName, () => App);
