import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as encoding from 'text-encoding'; // don't remove this line
import { saveState } from './src/store/user';

import RootContext from './src/contexts';
import { setFilter } from './src/store/chat';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import DetailChatScreen from './src/screens/DetailChatSreen';
import { Button } from '@ant-design/react-native';

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

  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerRight: () => (
          <Button
            onPress={() => {
              dispatch(
                saveState({
                  isLogin: false,
                  tokenGateway: '',
                  currentUser: '',
                  userId: '',
                }),
              );
            }}
            style={{ marginRight: 10 }}>
            Đăng xuất
          </Button>
        ),
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
            <MaterialCommunityIcons
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
            <MaterialCommunityIcons
              name="message-text-outline"
              size={size}
              color={color}
            />
          ),
          ...(roomsInfo?.processing && { tabBarBadge: roomsInfo?.processing }),
        }}
        component={ChatScreen}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const isLogin = useSelector(state => state?.user?.isLogin ?? false);

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
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </RootContext>
  );
}
