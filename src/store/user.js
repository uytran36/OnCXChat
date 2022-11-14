import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '62fcbbb75a2233315585ff17',
    tokenGateway:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2NudHgiLCJhdXRob3JpdGllcyI6WyJnYUxqRnoiXSwic2Vzc2lvbklkIjoiMjFiNmYxMGYtMzk2Ny00YmVlLWJhZjctYzAzMDVjYjE0NTcyIiwiaWF0IjoxNjY4MjM4MjgxLCJleHAiOjE2NjgzMjQ2ODF9.xFTkRS0VxKzLCaxBOUxKQHzbq1IcyAdLOJpNlM0Sm9xomApl2cRM33_iZsEUM7D-lxBqShdAlMbzHOuDV8F5PA',
    currentUser: {
      id: '62fcbbb75a2233315585ff17',
      username: 'locntx',
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
