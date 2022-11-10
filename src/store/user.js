import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '62fcbbb75a2233315585ff17',
    tokenGateway:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2NudHgiLCJhdXRob3JpdGllcyI6WyJnYUxqRnoiXSwic2Vzc2lvbklkIjoiMmY1MzQwNzgtNjlkMS00YTk1LTgzMGItMWY0ZmEwN2JiYjZlIiwiaWF0IjoxNjY4MDUxNzg1LCJleHAiOjE2NjgxMzgxODV9.9NHQEJemEeKkdjO9gefsFm0CzmXBKlEQ0QwvcxvRjoK0fWgysPe4NzCza8AnDGUPs5JMsFjdBb5L5lsLOCmvAw',
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
