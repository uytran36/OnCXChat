import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { VirtualizedList } from 'react-native';

import { useHeaders } from '../../../contexts';
import { useQueryMessages } from '../Hooks/useChat';

import LoadingOverlay from '../../LoadingOverlay';
import Message from '../Message';

const Messages = ({ roomId }) => {
  const headers = useHeaders();

  const [isMounted, setIsMounted] = useState(false);

  const {
    listMessage,
    onNextPageListMessage,
    hasNextPage,
    isFetchingNextPage: isLoadMore,
  } = useQueryMessages(headers, {
    roomId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);
    return () => {
      timer && clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

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
      await onNextPageListMessage();
    }
  }, [isLoadMore, isMounted, hasNextPage, onNextPageListMessage]);

  return (
    <>
      {!isMounted && <LoadingOverlay />}
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
    </>
  );
};

Messages.propTypes = {
  roomId: PropTypes.string,
};

Messages.defaultProps = {
  roomId: '',
};

export default Messages;
