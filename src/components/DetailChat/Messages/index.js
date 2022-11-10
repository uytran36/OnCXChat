import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { VirtualizedList } from 'react-native';

import { useHeaders } from '../../../contexts';
import Loading from '../../Loading';
import { useQueryMessages } from '../Hooks/useChat';

import Message from '../Message';

const Messages = ({ roomId }) => {
  const headers = useHeaders();

  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const {
    listMessage,
    onNextPageListMessage,
    onRefreshListMessage,
    hasNextPage,
    loading: isLoadingListMessage,
  } = useQueryMessages(headers, {
    roomId,
  });

  const renderItem = useCallback(
    ({ item }) => <Message messageInfo={item} />,
    [],
  );

  const keyExtractor = useCallback(
    ({ message, index }) => message?.mid ?? index,
    [],
  );

  const getItem = useCallback(
    (data, index) => ({ message: data[index], index, listMessage: data }),
    [],
  );

  const getItemCount = useCallback(data => data?.length ?? 0, []);

  const handleLoadMore = useCallback(async () => {
    if (isMounted && !isLoadMore && hasNextPage) {
    }
  }, [isLoadMore, isMounted, hasNextPage]);

  if (isLoadingListMessage) {
    return <Loading />;
  }

  return (
    <VirtualizedList
      inverted
      data={listMessage ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
    />
  );
};

Messages.propTypes = {
  roomId: PropTypes.string,
};

Messages.defaultProps = {
  roomId: '',
};

export default Messages;
