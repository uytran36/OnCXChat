import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState: {
    filter: {
      page: 0,
      limit: 10,
      filter: 'ALL',
      status: 'WAITING',
      type: '',
      order: 'LATEST',
      readFilter: false,
      pageId: '',
      tagIds: '',
      tagFilter: '',
      phoneFilter: '',
      mobileFirst: false,
      isHide: false,
      from: moment().subtract(29, 'day').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
    },
    roomsInfo: {},
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...(action?.payload ?? {}) };
    },
    saveState: (state, action) => {
      return { ...state, ...(action?.payload ?? {}) };
    },
    saveLoadMore: (state, action) => {
      state.roomsInfo.next = action.payload.next;
      state.roomsInfo.rooms = state.roomsInfo.rooms.concat(
        action.payload.rooms,
      );
    },
    reset: state => {
      state.filter.page = 0;
      state.roomsInfo = {};
    },
  },
});

export const setFilter = chatSlice.actions.setFilter;
export const saveState = chatSlice.actions.saveState;
export const saveLoadMore = chatSlice.actions.saveLoadMore;
export const reset = chatSlice.actions.reset;

export default chatSlice.reducer;
