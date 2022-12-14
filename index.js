/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

// PushNotification.configure({
//   onNotification: function ({ data }) {
//     // if (data?.status === 'WAITING') {
//     //   navigate('Chat');
//     // } else if (data?.status === 'PROCESSING') {
//     //   navigate('DetailChat', { roomId: data?.id, roomName: data?.roomName });
//     // }
//   },
//   requestPermissions: Platform.OS === 'ios',
// });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { room } = remoteMessage.data;
  console.log('kill', JSON.parse(room));
  // const data = JSON.parse(room);
  // if (data?.status === 'WAITING') {
  //   navigation.navigate('Chat');
  // } else if (data?.status === 'PROCESSING') {
  //   navigation.navigate('DetailChat', {
  //     roomId: data?.id,
  //     roomName: data?.roomName,
  //   });
  // }
});

AppRegistry.registerComponent(appName, () => App);
