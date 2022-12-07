import { Drawer } from '@ant-design/react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from './src/utils/rootNavigation';
import * as encoding from 'text-encoding'; // don't remove this line

import { useEffect, useRef } from 'react';
import Sidebar from './src/components/Chat/Sidebar';
import CustomHeader from './src/components/Header';
import RootContext from './src/contexts';
import ChatScreen from './src/screens/ChatScreen';
import DetailChatScreen from './src/screens/DetailChatSreen';
import LoginScreen from './src/screens/LoginScreen';
import { setFilter } from './src/store/chat';

moment.updateLocale('vi', {
  relativeTime: {
    past: '%s',
    s: '%d second',
    ss: '%d second',
    m: '%d minute',
    mm: '%d minute',
    h: '%d hour',
    hh: '%d hour',
    d: '%d day',
    dd: '%d day',
    w: '%d week',
    ww: '%d week',
    M: '%d month',
    MM: '%d month',
    y: '%d year',
    yy: '%d year',
  },
  weekdaysMin: ['cn', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'],
  calendar: {
    sameDay: 'LT',
    nextDay: 'L',
    nextWeek: 'L',
    lastDay: 'LT',
    lastWeek: 'LT',
    sameElse: 'L',
  },
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomNavigation = () => {
  const roomsInfo = useSelector(state => state.chat.roomsInfo);
  const dispatch = useDispatch();
  const elRef = useRef(null);

  return (
    <Drawer
      sidebar={<Sidebar elRef={elRef} />}
      open={false}
      position="right"
      drawerRef={el => (elRef.current = el)}
      drawerBackgroundColor="#FFFFFF">
      <Tab.Navigator
        screenOptions={{
          unmountOnBlur: true,
          header: props => <CustomHeader elRef={elRef} {...props} />,
        }}
        screenListeners={{
          state: e => {
            const { index, routeNames } = e?.data?.state;
            dispatch(
              setFilter({
                status: routeNames[index],
                filter: routeNames[index] === 'WAITING' ? 'ALL' : 'PROCESSING',
                page: 0,
              }),
            );
          },
        }}>
        <Tab.Screen
          name="WAITING"
          options={{
            title: 'Đang chờ',
            tabBarLabel: 'Đang chờ',

            tabBarIcon: ({ color, size }) => (
              <Icon
                name="message-text-clock-outline"
                size={size}
                color={color}
              />
            ),
            ...(roomsInfo?.waiting && { tabBarBadge: roomsInfo?.waiting }),
          }}
          component={ChatScreen}
        />
        <Tab.Screen
          name="RECEIVED"
          options={{
            title: 'Đã nhận',
            tabBarLabel: 'Đã nhận',
            tabBarIcon: ({ color, size }) => (
              <Icon name="message-text-outline" size={size} color={color} />
            ),
            ...(roomsInfo?.processing && {
              tabBarBadge: roomsInfo?.processing,
            }),
          }}
          component={ChatScreen}
        />
      </Tab.Navigator>
    </Drawer>
  );
};

const Navigation = () => {
  const isLogin = useSelector(state => state?.user?.isLogin ?? false);

  useEffect(() => {
    createChannels();
    return () => {
      PushNotification.deleteChannel('chat-notification');
    };
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'chat-notification',
      channelName: 'Chat Notification',
    });
  };

  if (!isLogin) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        options={{ headerShown: false }}
        component={BottomNavigation}
      />
      <Stack.Screen name="DetailChat" component={DetailChatScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <RootContext>
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
    </RootContext>
  );
}
