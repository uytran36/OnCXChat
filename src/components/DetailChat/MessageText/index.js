import PropTypes from 'prop-types';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

const MessageText = ({
  text,
  system,
  style,
  mid,
  customer,
  reply,
  inverse,
  other,
}) => {
  return (
    <Text
      id={mid}
      style={[
        styles.messageText,
        inverse && styles.messageTextInverse,
        other && styles.messageTextOther,
        !!system && styles.messageTextSystem,
        !!reply && styles.messageTextReply,
        style,
      ]}>
      {text}
    </Text>
  );
};

MessageText.propTypes = {
  text: PropTypes.string,
  system: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  mid: PropTypes.string,
  customer: PropTypes.bool,
  reply: PropTypes.bool,
  inverse: PropTypes.bool,
  other: PropTypes.bool,
};

MessageText.defaultProps = {
  text: '',
  system: false,
  style: {},
  mid: '',
  customer: false,
  reply: false,
  inverse: false,
  other: false,
};

export default memo(MessageText);

const styles = StyleSheet.create({
  messageText: {
    fontSize: 16,
    color: '#000000d9',
  },
  messageTextSystem: {
    fontStyle: 'italic',
  },
  messageTextInverse: {
    color: '#fff',
  },
  messageTextOther: {
    color: '#fff',
  },
  messageTextReply: {
    color: '#2f343d',
  },
});
