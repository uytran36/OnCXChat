import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';

import ChatScreen from './src/screens/ChatScreen';
import LoginScreen from './src/screens/LoginScreen';
import { store } from './src/store';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  // const isLogin = useSelector(state => state?.user?.isLogin ?? false);

  // if (!isLogin) {
  //   return <LoginScreen />;
  // }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}
