import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    userId: '62fcbbb75a2233315585ff17',
    tokenGateway:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2NudHgiLCJhdXRob3JpdGllcyI6WyJnYUxqRnoiXSwic2Vzc2lvbklkIjoiMTAzZTdiMGMtNWUxZC00NWMzLWI4NTEtNjgyODg5YjM2YjExIiwiaWF0IjoxNjY4NjA1NzU2LCJleHAiOjE2Njg2OTIxNTZ9.ji5GSVnLl48MthbCuEjbqZU4a8Ihgec7vWlGyQ4DqJpwcfi_Xbp7nuAj00R_l1A0AUijT4peviRfVym_wkffJQ',
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
