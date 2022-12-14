import { Button, Card, InputItem } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { saveState } from '../../src/store/user';
import background from '../assets/background.png';
import LoadingOverlay from '../components/LoadingOverlay';
import { requestFetchMe, requestLogin } from '../services/login';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@OnCX:accessToken', `Bearer ${value}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickLogin = async () => {
    setLoading(true);
    try {
      const res = await requestLogin({ username, password });
      setLoading(false);
      if (res.status === 200) {
        storeData(res?.data?.tokenGateway);
        dispatch(
          saveState({
            isLogin: true,
            tokenGateway: `Bearer ${res?.data?.tokenGateway}`,
            currentUser: res?.data?.user?.data?.me,
            userId: res?.data?.user?.data?.userId,
            refreshToken: res?.data?.refreshToken,
          }),
        );
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert('Lỗi', 'Đăng nhập không thành công', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  const checkToken = useCallback(async () => {
    try {
      setLoading(true);
      const value = await AsyncStorage.getItem('@OnCX:accessToken');
      if (value) {
        const headers = {
          authorization: value,
        };
        const res = await requestFetchMe(headers);
        setLoading(false);
        if (res?.status === 200) {
          dispatch(
            saveState({
              isLogin: true,
              tokenGateway: value,
              currentUser: res?.data?.me,
              userId: res?.data?.me?.id,
            }),
          );
        }
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <View style={styles.container}>
          <ImageBackground
            source={background}
            style={{ width: '100%', height: '100%' }}>
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <View style={styles.login}>
                  <Text style={styles.title}>Đăng nhập</Text>
                  <View style={styles.form}>
                    <Text>Tên đăng nhập</Text>
                    <InputItem
                      value={username}
                      onChange={value => setUsername(value)}
                      placeholder="Nhập tên đăng nhập"
                      type="text"
                    />

                    <Text>Mật khẩu</Text>
                    <InputItem
                      value={password}
                      onChange={value => setPassword(value)}
                      placeholder="Nhập mật khẩu"
                      type="password"
                    />
                  </View>
                </View>
                <View style={styles.button}>
                  <Button onPress={handleClickLogin} type="primary">
                    OK
                  </Button>
                </View>
              </Card.Body>
            </Card>
          </ImageBackground>
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  cardBody: {
    marginTop: 20,
    marginBottom: 20,
    borderColor: '#FFFFFF',
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginLeft: 12,
    paddingRight: 12,
  },
  button: {
    marginRight: 12,
  },
});
