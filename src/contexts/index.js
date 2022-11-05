import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { Provider } from 'react-redux';
import WithWebsocketProvider from './Websocket.context';
import WithHeadersProvider from './Headers.context';

import { store } from '../store';

const wsId = uuid.v4();

export default function RootContext({ children }) {
  return (
    <Provider store={store}>
      <WithHeadersProvider>
        <WithWebsocketProvider wsId={wsId}>{children}</WithWebsocketProvider>
      </WithHeadersProvider>
    </Provider>
  );
}

RootContext.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

// headers
export { useHeaders } from './Headers.context';

// stomp socket
export { useStompSocket } from './Websocket.context';
