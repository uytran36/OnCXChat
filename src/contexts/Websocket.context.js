import PropTypes from 'prop-types';
import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NewSetupSocket } from '../utils/stomp';

/**
 * @type {WebsocketContext}
 */
const WebsocketContext = createContext(null);

function useSetupWebsocket(currentUser, token, wsId) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    NewSetupSocket.onConnect({
      dispatch,
      wsId,
      userId: currentUser?.id,
      agentUuid: currentUser?.extension?.agentUuid || '',
      username: currentUser?.username,
      token,
    });
    dispatch({
      type: 'user/saveState',
      payload: {
        wsId,
      },
    });
    return () => {
      NewSetupSocket.onDisconnect();
    };
  }, [dispatch, token, wsId]);

  return { ws: NewSetupSocket };
}

function WithWebsocketProvider({ children, wsId }) {
  const { currentUser, tokenGateway } = useSelector(state => state.user);
  const { ws } = useSetupWebsocket(currentUser, tokenGateway, wsId);

  return (
    <WebsocketContext.Provider value={ws}>{children}</WebsocketContext.Provider>
  );
}

WithWebsocketProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  wsId: PropTypes.string,
};

WithWebsocketProvider.defaultProps = {
  wsId: '',
};

export default WithWebsocketProvider;

export const useStompSocket = () => useContext(WebsocketContext);
