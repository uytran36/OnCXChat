import { StyleSheet, Text, View } from 'react-native';
import Action from './Action';
import Messages from './Messages';

const DetailChat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.MessagesContainer}>
        <Messages />
      </View>
      <View style={styles.ActionContainer}>
        <Action />
      </View>
    </View>
  );
};

export default DetailChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  MessagesContainer: {
    flex: 0.95,
  },
  ActionContainer: {
    flex: 0.05,
  },
});
