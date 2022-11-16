import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, VirtualizedList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { chatConstants } from '../../../constants/chat';
import { useHeaders } from '../../../contexts';
import {
  requestAcceptRoom,
  requestGetRoomsInfo,
  requestReadMessage,
} from '../../../services/chat';
import { saveLoadMore, saveState, setFilter } from '../../../store/chat';

import Loading from '../../Loading';
import Room from '../Room';

const ListRoom = () => {
  const { filter, roomsInfo } = useSelector(state => state.chat);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const headers = useHeaders();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const getRoomsInfo = useCallback(async () => {
    if (isMounted && !filter.page) {
      setIsFetching(true);
      const res = await requestGetRoomsInfo(headers, filter);
      setIsFetching(false);
      if (res.status === 200) {
        dispatch(
          saveState({
            roomsInfo: res.data.response.roomsInfo,
          }),
        );
      }
    }
  }, [isMounted, headers, filter, dispatch]);

  useLayoutEffect(() => {
    getRoomsInfo();
  }, [getRoomsInfo]);

  const handleAcceptRoom = useCallback(
    async (roomId, roomName) => {
      if (!roomId) {
        return null;
      }
      const res = await requestAcceptRoom(
        headers,
        {
          roomId,
        },
        {
          username: currentUser.username,
          id: headers['userId'],
          avatar: `${chatConstants.AVATAR_AGENT_BASE_URL}/${currentUser.username}`,
        },
      );
      if (res?.status === 200) {
        // Alert.alert(`Bạn đã nhận cuộc hội thoại của ${roomName}!`);
        return null;
      }
      Alert.alert(`Bạn không thể nhận cuộc hội thoại của ${roomName}!`);
      return null;
    },
    [headers],
  );

  const readMessage = useCallback(
    async roomId => {
      if (!roomId) return;
      const res = await requestReadMessage(headers, { roomId });
      console.log(res);
    },
    [headers],
  );

  const handleClickRoom = useCallback(
    async (roomId, roomName, isUnread, agent) => {
      if (isUnread && agent?.id === currentUser?.id) {
        // readMessage(roomId);
      }
      navigation.navigate('DetailChat', { roomId, roomName });
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Room
        info={item}
        onAcceptRoom={handleAcceptRoom}
        onClickRoom={handleClickRoom}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(item => item.id, []);

  const getItem = useCallback((data, index) => data[index], []);

  const getItemCount = useCallback(data => data?.length ?? 0, []);

  const handleLoadMore = useCallback(async () => {
    if (isMounted && !isLoadMore && roomsInfo.next) {
      const newFilter = { ...filter, page: filter.page + 1 };
      dispatch(setFilter({ page: filter.page + 1 }));
      setIsLoadMore(true);
      const res = await requestGetRoomsInfo(headers, newFilter);
      setIsLoadMore(false);
      if (res.status === 200) {
        dispatch(saveLoadMore(res.data.response.roomsInfo));
      }
    }
  }, [headers, filter, roomsInfo, isLoadMore, isMounted]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <VirtualizedList
      data={roomsInfo?.rooms ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
    />
  );
};

export default ListRoom;
