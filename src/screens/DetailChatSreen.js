import { useEffect } from 'react';

import DetailChat from '../components/DetailChat';

const DetailChatScreen = ({ route, navigation }) => {
  const { roomId, roomName } = route?.params;

  useEffect(() => {
    navigation.setOptions({
      title: roomName ?? '',
    });
  }, [navigation, roomName]);

  return <DetailChat roomId={roomId} />;
};

export default DetailChatScreen;
