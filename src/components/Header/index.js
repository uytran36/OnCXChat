import { Pressable, StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { saveState } from '../../../src/store/user';
import { Button } from '@ant-design/react-native';
import { setFilter } from '../../../src/store/chat';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { requestLogout } from '../../services/login';
import { useHeaders } from '../../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = props => {
  const dispatch = useDispatch();
  const headers = useHeaders();

  const refreshToken = useSelector(({ user }) => user.refreshToken);

  const handleSearch = text => {
    dispatch(
      setFilter({
        q: text,
      }),
    );
  };
  const handleClickFilter = () => {
    props.elRef.current.openDrawer();
  };

  return (
    <SafeAreaView style={styles.headerWrapper}>
      <View style={styles.headerTitleWrapper}>
        <Text style={styles.headerTitle}>{props.options.title}</Text>
        <Pressable>
          <AntIcon
            name="logout"
            size={24}
            onPress={async () => {
              try {
                const res = await requestLogout(headers, refreshToken);
                if (res.status === 200) {
                  await AsyncStorage.removeItem('@OnCX:accessToken');
                  dispatch(
                    saveState({
                      isLogin: false,
                      tokenGateway: '',
                      currentUser: '',
                      userId: '',
                      refreshToken: '',
                    }),
                  );
                }
              } catch (err) {
                console.log(err);
              }
            }}
          />
        </Pressable>
      </View>
      <View style={styles.searchAndFilter}>
        <View style={styles.searchWrapper}>
          <AntIcon
            style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 8 }}
            name="search1"
            size={18}
            color="black"
          />
          <TextInput
            style={styles.input}
            placeholder="T??m t??n, s??? ??i???n tho???i"
            onChangeText={text => handleSearch(text)}
          />
        </View>
        <Button style={styles.button} onPress={handleClickFilter}>
          <IonIcon name="filter-outline" size={24} color="black" />
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  searchWrapper: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '80%',
  },
  searchAndFilter: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  button: {
    marginLeft: 8,
    height: 36,
  },
});
