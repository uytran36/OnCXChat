import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '62fcbbb75a2233315585ff17',
    tokenGateway:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2NudHgiLCJhdXRob3JpdGllcyI6WyJnYUxqRnoiXSwic2Vzc2lvbklkIjoiMTA4ZDJhNDAtOGVmNy00MzJjLTk1OGYtNTkxZDE1YzVmMmM4IiwiaWF0IjoxNjY3NjM5OTI2LCJleHAiOjE2Njc3MjYzMjZ9.zNtSYs31cDpe5JV0pjZmxnO9SnvC7LR-PCGZoG99GOrfYIp5nE7y8R6mH2Ox0ZfiCxfNjZp0ozda7n30uhRRhw',
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
      state = { ...state, ...(action?.payload ?? {}) };
    },
  },
});

export default userSlice.reducer;
