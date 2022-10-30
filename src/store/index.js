import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user';
import chatReducer from './chat';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});
