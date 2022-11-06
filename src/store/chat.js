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
      order: false,
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
    roomInfo: {},
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
    updateTab: (state, action) => {
      const { waiting, processing } = action.payload;
      const stateWating = parseInt(state?.roomsInfo?.waiting ?? 0, 10);
      const stateProcessing = parseInt(state?.roomsInfo?.processing ?? 0, 10);
      state.roomsInfo.waiting =
        stateWating === 0 && waiting < 0 ? 0 : stateWating + waiting;
      state.roomsInfo.processing =
        stateProcessing === 0 && processing < 0
          ? 0
          : stateProcessing + processing;
    },
    mutationListRoom: (state, act) => {
      const { roomInfo, action } = act.payload;
      const listRoom = state?.roomsInfo?.rooms ?? [];
      switch (action) {
        case 'ADD_TO': {
          if (!roomInfo?.id) {
            return;
          }
          const newList = [roomInfo, ...listRoom];
          state.roomsInfo.rooms = newList;
          break;
        }
        case 'REPLACE_TO_FIRST': {
          if (!roomInfo?.id) {
            return;
          }
          const cloneListRoom = JSON.parse(JSON.stringify(listRoom));
          const index = cloneListRoom.findIndex(
            room => room.id === roomInfo.id,
          );
          // Có itemRemove => replace data + đẩy lên đầu
          // Không có itemRemove => đẩy lên đầu
          if (index >= 0) {
            const itemRemoved = cloneListRoom[index];
            cloneListRoom.splice(index, 1);
            state.roomsInfo.rooms = [
              { ...itemRemoved, ...roomInfo },
              ...cloneListRoom,
            ];
            break;
          }
          state.roomsInfo.rooms = [{ ...roomInfo }, ...cloneListRoom];
          break;
        }
        case 'REPLACE': {
          if (!roomInfo?.id) {
            return;
          }
          const cloneListRoom = JSON.parse(JSON.stringify(listRoom));
          const index = cloneListRoom.findIndex(
            room => room.id === roomInfo.id,
          );
          if (index >= 0) {
            cloneListRoom[index] = {
              ...cloneListRoom[index],
              ...roomInfo,
            };
          }
          state.roomsInfo.rooms = cloneListRoom;
          break;
        }
        case 'DELETE': {
          if (!roomInfo?.id) {
            return;
          }
          const newListRoom = listRoom.filter(room => room.id !== roomInfo.id);
          const { resolve } = act.payload;
          resolve?.(newListRoom.length < listRoom.length);
          state.roomsInfo.rooms = newListRoom;
          break;
        }
        default: {
          state.roomsInfo.rooms = listRoom.concat(act.payload.listRoom);
          state.roomsInfo.waiting = act.payload.waiting;
          state.roomsInfo.processing = act.payload.processing;
          break;
        }
      }
    },
    updateRoomInfoStateByRoomId: (state, action) => {
      const { roomId, roomModel, resolve } = action.payload;
      if (!roomId) {
        return null;
      }
      const roomInfo = state.roomInfo;
      if (roomInfo.id === roomId) {
        if (resolve && typeof resolve === 'function') {
          resolve();
        }
        state.roomInfo = roomModel || {};
      }
    },
  },
});

export const setFilter = chatSlice.actions.setFilter;
export const saveState = chatSlice.actions.saveState;
export const saveLoadMore = chatSlice.actions.saveLoadMore;
export const reset = chatSlice.actions.reset;
export const updateTab = chatSlice.actions.updateTab;
export const mutationListRoom = chatSlice.actions.mutationListRoom;
export const updateRoomInfoStateByRoomId =
  chatSlice.actions.updateRoomInfoStateByRoomId;

export default chatSlice.reducer;
