import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  mutationListRoom,
  updateRoomInfoStateByRoomId,
  updateTab,
} from '../store/chat';

const ACTIONS = {
  NEW_ROOM: 'NEW_ROOM',
  APPROVE_ROOM: 'APPROVE_ROOM',
  CLOSE_ROOM: 'CLOSE_ROOM',
  FORWARD_ROOM: 'FORWARD_ROOM',
  ROLLBACK_ROOM: 'ROLLBACK_ROOM',
  ACCEPT_FORWARD_ROOM: 'ACCEPT_FORWARD_ROOM',
  DECLINE_FORWARD_ROOM: 'DECLINE_FORWARD_ROOM',

  NEW_LAST_MESSAGE: 'NEW_LAST_MESSAGE',
  VISITOR_CLOSE_ROOM: 'VISITOR_CLOSE_ROOM',
  FORWARD_ROOM_WS: 'FORWARD_ROOM_WS',
  NEW_APPROVED_FORWARD_ROOM: 'NEW_APPROVED_FORWARD_ROOM',
  UPDATE_TAG: 'UPDATE_TAG',
  SEEN_MESSAGE: 'SEEN_MESSAGE',
  RE_OPEN_ROOM: 'RE_OPEN_ROOM',
};

export function useCountTab(filter, currentUser, allChat) {
  const dispatch = useDispatch();

  const WAITING = useMemo(() => filter.status === 'WAITING', [filter.status]);
  const OFFLINE = useMemo(
    () => filter.status === 'WAITING' && filter.filter === 'OFFLINE',
    [filter.status],
  );
  const PROCESSING = useMemo(
    () => filter.status === 'RECEIVED' && filter.filter === 'PROCESSING',
    [filter.filter, filter.status],
  );
  const FORWARD = useMemo(
    () => filter.status === 'RECEIVED' && filter.filter === 'IS_FORWARDED',
    [filter.filter, filter.status],
  );
  const COMPLETE = useMemo(
    () => filter.status === 'RECEIVED' && filter.filter === 'RESOLVED',
    [filter.filter, filter.status],
  );

  const isSelectChannel = useCallback(
    roomInfo => {
      if (filter.type.length === 0) {
        return true;
      }
      if (filter.type.join('') === 'ZALO' && roomInfo.type === 'ZALO') {
        return true;
      }
      if (filter.type.join('') === 'LIVECHAT' && roomInfo.type === 'LIVECHAT') {
        return true;
      }
      if (filter.type.join('') === 'FACEBOOK') {
        if (
          filter.pageId.length === 0 ||
          filter.pageId === roomInfo?.pageInfo?.pageId
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    [filter],
  );

  const handleSaveState = useCallback(
    ({ waiting, processing }) => {
      // sẽ chỉ có giá trị -1 0 +1
      dispatch(updateTab({ waiting, processing }));
    },
    [dispatch],
  );

  const handleMutationListRoom = useCallback(
    (action, roomInfo = {}, resolve = () => null) => {
      dispatch(mutationListRoom({ action, roomInfo, resolve }));
    },
    [dispatch],
  );

  const handleCountTab = useCallback(
    (action, options) => {
      const { roomInfo } = options;
      /**
       * Khi thay đổi giá trị filter thì số đếm ở tab sẽ trả về giá trị như sau:
       * - Đang chờ (active): số đếm tab đã nhận có status = RECEIVED & filter = PROCESSING
       * - Đã nhận (active): số đếm đang chờ có status = WAITING & filter = ALL
       */
      switch (action) {
        case ACTIONS.NEW_ROOM: {
          handleSaveState({
            waiting: 1,
            processing: 0,
          });
          if (WAITING) {
            if (isSelectChannel(roomInfo)) {
              handleMutationListRoom('ADD_TO', roomInfo);
            }
          }
          break;
        }
        case ACTIONS.NEW_LAST_MESSAGE: {
          dispatch(
            updateRoomInfoStateByRoomId({
              roomId: roomInfo.id,
              roomModel: roomInfo,
            }),
          );
          if (WAITING) {
            if (
              OFFLINE &&
              roomInfo.status === 'WAITING' &&
              !roomInfo?.liveChatSession?.isAgentOnline
            ) {
              handleMutationListRoom('REPLACE_TO_FIRST', roomInfo);
              break;
            }
            if (
              roomInfo.status === 'WAITING' ||
              (roomInfo.status === 'PROCESSING' &&
                roomInfo?.forward?.status &&
                (roomInfo?.forward?.to === currentUser.username || allChat))
            )
              handleMutationListRoom('REPLACE_TO_FIRST', roomInfo);
            break;
          }
          if (
            PROCESSING &&
            roomInfo.status === 'PROCESSING' &&
            (!roomInfo.forward || !roomInfo?.forward?.status)
          ) {
            // room cua minh
            if (roomInfo?.agent?.id === currentUser.id || allChat) {
              handleMutationListRoom('REPLACE_TO_FIRST', roomInfo);
            }
            break;
          }
          break;
        }
        case ACTIONS.SEEN_MESSAGE:
        case ACTIONS.UPDATE_TAG:
        case ACTIONS.VISITOR_CLOSE_ROOM: {
          handleMutationListRoom('REPLACE', roomInfo);
          dispatch(
            updateRoomInfoStateByRoomId({
              roomId: roomInfo.id,
              roomModel: roomInfo,
            }),
          );
          break;
        }
        case ACTIONS.APPROVE_ROOM: {
          const triggerByMe = currentUser.id === options?.triggerBy;
          dispatch(
            updateRoomInfoStateByRoomId({
              roomId: roomInfo.id,
              roomModel: roomInfo,
            }),
          );
          // tăng count lên 1 nếu agent role all chat hoặc room của mình chấp nhận
          if (triggerByMe || allChat) {
            if (PROCESSING) {
              if (isSelectChannel(roomInfo)) {
                handleMutationListRoom('ADD_TO', roomInfo);
                handleSaveState({
                  waiting: -1,
                  processing: 0,
                });
              }
            }
            if (WAITING) {
              handleMutationListRoom('DELETE', roomInfo);
            }
            handleSaveState({
              waiting: -1,
              processing: 1,
            });
            break;
          }
          handleMutationListRoom('DELETE', roomInfo, isDeleted => {
            if (isDeleted) {
              handleSaveState({
                waiting: -1,
                processing: 0,
              });
            }
          });
          break;
        }
        case ACTIONS.CLOSE_ROOM: {
          const triggerByMe = currentUser.id === options?.triggerBy;
          dispatch(
            updateRoomInfoStateByRoomId({
              roomId: roomInfo.id,
              roomModel: roomInfo,
            }),
          );
          if (COMPLETE && (triggerByMe || allChat)) {
            if (isSelectChannel(roomInfo)) {
              handleMutationListRoom('ADD_TO', roomInfo);
            }
            handleSaveState({
              waiting: 0,
              processing: 1,
            });
            break;
          }
          if ((triggerByMe || allChat) && (PROCESSING || WAITING)) {
            handleMutationListRoom('DELETE', roomInfo);
            handleSaveState({
              waiting: 0,
              processing: -1,
            });
            break;
          }
          break;
        }
        default:
          break;
      }
    },
    [
      handleSaveState,
      WAITING,
      isSelectChannel,
      handleMutationListRoom,
      dispatch,
      PROCESSING,
      OFFLINE,
      currentUser.username,
      currentUser.id,
      FORWARD,
      COMPLETE,
      allChat,
    ],
  );
  return {
    countTab: handleCountTab,
  };
}
