import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const Action = ({ loading, onChangeActionHeight, onSendMessage }) => {
  const [text, setText] = useState('');

  const handleChangeText = text => {
    setText(text);
  };

  const handleContentSizeChange = e => {
    const height = e.nativeEvent.contentSize.height;
    onChangeActionHeight?.(height);
  };

  const handlePressSendBtn = async () => {
    const sended = await onSendMessage?.(text?.trim());
    if (sended) {
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhắn tin"
          multiline
          value={text}
          onChangeText={handleChangeText}
          onContentSizeChange={handleContentSizeChange}
          style={styles.input}
        />
      </View>
      <View style={styles.sendBtnContainer}>
        <Pressable
          android_ripple={{ color: '#cccccc', borderless: true }}
          style={({ pressed }) => [
            styles.sendBtn,
            pressed && Platform.OS === 'ios' && styles.btnPressed,
          ]}
          disabled={loading || text?.trim?.()?.length === 0}
          onPress={handlePressSendBtn}>
          {loading ? (
            <ActivityIndicator size={24} color="#127ace" />
          ) : (
            <Ionicons name="send" size={24} color="#127ace" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

Action.propTypes = {
  loading: PropTypes.bool,
  onChangeActionHeight: PropTypes.func,
  onSendMessage: PropTypes.func,
};

Action.defaultProps = {
  loading: false,
  onChangeActionHeight: () => null,
  onSendMessage: () => null,
};

export default Action;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 0.9,
  },
  input: {
    padding: 10,
    borderRadius: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.125,

    elevation: 2,
  },
  sendBtnContainer: {
    flex: 0.1,
    margin: 4,
  },
  sendBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPressed: {
    backgroundColor: '#cccccc',
  },
});
