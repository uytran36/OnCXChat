import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import { store } from '../store';
import WithHeadersProvider from './Headers.context';
import WithWebsocketProvider from './Websocket.context';

const queryClient = new QueryClient();
const wsId = uuid.v4();

export default function RootContext({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WithHeadersProvider>
          <WithWebsocketProvider wsId={wsId}>{children}</WithWebsocketProvider>
        </WithHeadersProvider>
      </QueryClientProvider>
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


