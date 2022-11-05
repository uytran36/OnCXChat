import PropTypes from 'prop-types';
import { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

const HeadersContext = createContext(null);

function WithHeadersProvider({ children }) {
  const { userId, tokenGateway } = useSelector(state => state.user);

  const headers = useMemo(
    () => ({ authorization: tokenGateway, userId }),
    [tokenGateway, userId],
  );

  return (
    <HeadersContext.Provider value={headers}>
      {children}
    </HeadersContext.Provider>
  );
}

WithHeadersProvider.proptypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default WithHeadersProvider;

const useHeaders = () => {
  const context = useContext(HeadersContext);
  return context || {};
};

export { useHeaders };
