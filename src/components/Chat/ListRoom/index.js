import { useCallback, useLayoutEffect, useState } from 'react';
import { VirtualizedList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useHeaders } from '../../../contexts';
import { requestGetRoomsInfo } from '../../../services/chat';
import { saveLoadMore, saveState, setFilter } from '../../../store/chat';
import Loading from '../../Loading';

import Room from '../Room';

const ListRoom = () => {
  const { filter, roomsInfo } = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const headers = useHeaders();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const getRoomsInfo = useCallback(async () => {
    if (!filter.page) {
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
  }, [filter, dispatch]);

  useLayoutEffect(() => {
    getRoomsInfo();
  }, [getRoomsInfo]);

  const renderItem = useCallback(({ item }) => <Room info={item} />, []);

  const keyExtractor = useCallback(item => item.id, []);

  const getItem = useCallback((data, index) => data[index], []);

  const getItemCount = useCallback(data => data?.length ?? 0, []);

  const handleLoadMore = useCallback(async () => {
    if (!isLoadMore && roomsInfo.next) {
      const newFilter = { ...filter, page: filter.page + 1 };
      dispatch(setFilter(newFilter));
      setIsLoadMore(true);
      const res = await requestGetRoomsInfo(headers, newFilter);
      setIsLoadMore(false);
      if (res.status === 200) {
        dispatch(saveLoadMore(res.data.response.roomsInfo));
      }
    }
  }, [filter, roomsInfo, isLoadMore]);

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
      onEndReachedThreshold={0.5}
    />
  );
};

export default ListRoom;
