/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

PushNotification.createChannel(
  {
    channelId: 'com.oncxchat-high-300', // (required)
    channelName: 'OnCX Chat', // (required)
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.getChannels(channels_id => {
  console.log(channels_id);
});

// PushNotification.configure({
//   onNotification: function ({ data }) {
//     console.log('day roi', data);
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
  //   RootNavigation.navigate('Chat');
  // } else if (data?.status === 'PROCESSING') {
  //   RootNavigation.navigate('DetailChat', {
  //     roomId: data?.id,
  //     roomName: data?.roomName,
  //   });
  // }
});

AppRegistry.registerComponent(appName, () => App);
