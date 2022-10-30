import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { VirtualizedList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { requestGetRoomsInfo } from '../../../services/chat';
import { saveLoadMore, setFilter } from '../../../store/chat';

import Room from '../Room';

const ListRoom = ({ listRoom }) => {
  const { filter, roomsInfo } = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const [isLoadMore, setIsLoadMore] = useState(false);

  const renderItem = useCallback(({ item }) => <Room info={item} />, []);

  const keyExtractor = useCallback(item => item.id, []);

  const getItem = useCallback((data, index) => data[index], []);

  const getItemCount = useCallback(data => data?.length ?? 0, []);

  const handleLoadMore = useCallback(async () => {
    if (!isLoadMore && roomsInfo.next) {
      const newFilter = { ...filter, page: filter.page + 1 };
      dispatch(setFilter(newFilter));
      setIsLoadMore(true);
      const res = await requestGetRoomsInfo(newFilter);
      setIsLoadMore(false);
      if (res.status === 200) {
        dispatch(saveLoadMore(res.data.response.roomsInfo));
      }
    }
  }, [filter, roomsInfo, isLoadMore]);

  return (
    <VirtualizedList
      data={listRoom ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
};

ListRoom.propTypes = {
  listRoom: PropTypes.array,
};

ListRoom.defaultProps = {
  listRoom: [],
};

export default ListRoom;
