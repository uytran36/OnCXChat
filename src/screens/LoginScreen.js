import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import background from '../../assets/background.png';
import { Card, InputItem, Button } from '@ant-design/react-native';
import { useState } from 'react';
import { requestLogin } from '../services/login';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClickLogin = async () => {
    const res = await requestLogin({ username, password });
    try {
      if (res.status === 200) {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
