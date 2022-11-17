import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '',
    tokenGateway: '',
    currentUser: {
      id: '',
      username: '',
    },
    wsId: '',
  },
  reducers: {
    changeLogin: (state, action) => {
      state.isLogin = !!(action?.payload ?? 0);
    },
    saveState: (state, action) => {
      return { ...state, ...(action?.payload ?? {}) };
    },
  },
});

export const saveState = userSlice.actions.saveState;

export default userSlice.reducer;
