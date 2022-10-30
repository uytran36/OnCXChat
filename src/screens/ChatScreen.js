import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { requestGetRoomsInfo } from '../services/chat';
import { saveState } from '../store/chat';

import ListRoom from '../components/Chat/ListRoom';
import Loading from '../components/Loading';

const ChatScreen = () => {
  const { filter, roomsInfo } = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const getRoomsInfo = useCallback(async () => {
    if (!filter.page) {
      setIsFetching(true);
      const res = await requestGetRoomsInfo(filter);
      setIsFetching(false);
      if (res.status === 200) {
        dispatch(
          saveState({
            roomsInfo: res.data.response.roomsInfo,
          }),
        );
      }
    }
  }, [filter, dispatch]);

  useEffect(() => {
    getRoomsInfo();
    return () => {};
  }, [getRoomsInfo]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ListRoom listRoom={roomsInfo.rooms} />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
