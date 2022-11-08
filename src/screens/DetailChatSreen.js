import { useEffect } from 'react';
import DetailChat from '../components/DetailChat';

const DetailChatScreen = ({ route, navigation }) => {
  const { roomId, roomName } = route?.params;

  useEffect(() => {
    navigation.setOptions({
      title: roomName ?? '',
    });
  }, []);

  return <DetailChat />;
};

export default DetailChatScreen;

