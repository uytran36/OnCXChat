import { useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useSelector } from 'react-redux';

import { useStompSocket } from '../contexts/Websocket.context';
import { stringToNumber } from '../utils';
import { useCountTab } from '../utils/useCountTab';

import ListRoom from '../components/Chat/ListRoom';

const ChatScreen = () => {
  const { filter } = useSelector(state => state.chat);
  const { currentUser, allChat } = useSelector(state => state.user);

  const StompSocket = useStompSocket();

  const { countTab } = useCountTab(filter, currentUser, allChat);

  const pushNotification = useCallback(room => {
    const id = stringToNumber(room?.id);
    PushNotification.localNotification({
      channelId: 'chat-notification',
      title: `${room?.lastMessage?.senderName} gửi tới ${room?.roomName}`,
      message: `${room?.lastMessage?.text}`,
      id: id,
      userInfo: room,
    });
  }, []);

  const handleWatchListRoom = useCallback(
    event => {
      const { eventType, room, triggerBy, to } = event;
      switch (eventType) {
        case 'NEW_ROOM': {
          countTab('NEW_ROOM', {
            roomInfo: room,
          });
          break;
        }
        case 'NEW_LAST_MESSAGE': {
          countTab('NEW_LAST_MESSAGE', {
            roomInfo: room,
          });
          // pushNotification(room);
          break;
        }
        case 'VISITOR_CLOSE_ROOM': {
          countTab('VISITOR_CLOSE_ROOM', {
            roomInfo: room,
          });
          break;
        }
        case 'APPROVED_ROOM': {
          countTab('APPROVE_ROOM', {
            triggerBy,
            roomInfo: room,
          });
          break;
        }
        case 'COMPLETE_ROOM': {
          countTab('CLOSE_ROOM', {
            roomInfo: room,
            triggerBy: event.triggerBy,
          });
          break;
        }
        case 'FORWARD_ROOM': {
          countTab('FORWARD_ROOM', {
            roomInfo: room,
            triggerBy,
            to,
          });
          break;
        }
        case 'NEW_APPROVED_FORWARD_ROOM': {
          countTab('ACCEPT_FORWARD_ROOM', {
            roomInfo: room,
            oldRoom: event.oldRoom,
            triggerBy,
          });
          break;
        }
        case 'DENIED_FORWARD_ROOM': {
          countTab('DECLINE_FORWARD_ROOM', {
            roomInfo: room,
            triggerBy,
            to,
          });
          break;
        }
        case 'SEEN_MESSAGE': {
          countTab('SEEN_MESSAGE', {
            roomInfo: room,
          });
          break;
        }
        default:
          return [];
      }
    },
    [countTab, pushNotification],
  );

  useEffect(() => {
    try {
      let listRoomSubscription;
      const timer = setTimeout(() => {
        listRoomSubscription = StompSocket.onWatchListRooms(
          {},
          handleWatchListRoom,
        );
      }, 1200);
      return () => {
        clearTimeout(timer);
        if (listRoomSubscription) {
          listRoomSubscription.unsubscribe();
        }
      };
    } catch (err) {
      if (err.includes('#399')) {
        console.log(err);
      }
    }
  }, [handleWatchListRoom, StompSocket]);

  return (
    <SafeAreaView style={styles.container}>
      <ListRoom />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
