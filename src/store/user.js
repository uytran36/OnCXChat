import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '62fcbbb75a2233315585ff17',
    tokenGateway:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2NudHgiLCJhdXRob3JpdGllcyI6WyJnYUxqRnoiXSwic2Vzc2lvbklkIjoiMmZlODQ5MWEtZmE1Ni00NDhlLThiNTctYWFiYTY5OGNiOGRmIiwiaWF0IjoxNjY3ODc1NTY3LCJleHAiOjE2Njc5NjE5Njd9.EYmhUTkMIVFAFxbGqXkOPTVxqxdZjbCzkbxaSHH6ZmbZoZTDwZ43WCUiSOlYkCd35iuGggOo2E65na2_Hz9bRA',
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
