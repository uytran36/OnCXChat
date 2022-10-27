import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    token: '',
  },
  reducers: {
    changeLogin: (state, action) => {
      state.isLogin = !!(action?.payload ?? 0);
    },
    saveState: (state, action) => {
      state = { ...state, ...(action?.payload ?? {}) };
    },
  },
});

export default userSlice.reducer;
