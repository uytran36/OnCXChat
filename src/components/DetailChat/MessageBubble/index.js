import PropTypes from 'prop-types';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const MessageBubble = ({
  inverse,
  other,
  nude,
  quoted,
  isImage,
  replyCustomer,
  reply,
  style,
  children,
  ts,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.messageBubble,
        inverse && styles.messageBubbleInverse,
        other && styles.messageBubbleOther,
        nude && styles.messageBubbleNude,
        quoted && styles.messageBubbleQuoted,
        isImage && styles.messageBubbleImage,
        isImage && inverse && styles.messageBubbleInverseImage,
        replyCustomer && styles.messageBubbleReplyCustomer,
        style,
      ]}
      {...rest}>
      <View style={styles.messageBubbleInner}>{children}</View>
    </View>
  );
};

MessageBubble.propTypes = {
  inverse: PropTypes.bool,
  other: PropTypes.bool,
  nude: PropTypes.bool,
  quoted: PropTypes.bool,
  isImage: PropTypes.bool,
  replyCustomer: PropTypes.bool,
  reply: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  ts: PropTypes.string,
};

MessageBubble.defaultProps = {
  inverse: false,
  other: false,
  nude: false,
  quoted: false,
  isImage: false,
  replyCustomer: false,
  reply: false,
  style: {},
  children: <View />,
  ts: '',
};

export default memo(MessageBubble);

const styles = StyleSheet.create({
  messageBubble: {
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 22,
  },
  messageBubbleInverse: {
    backgroundColor: '#127ace',
  },
  messageBubbleOther: {
    backgroundColor: '#127ace',
  },
  messageBubbleNude: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  messageBubbleQuoted: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
    backgroundColor: '#f7f8fa',
  },
  messageBubbleImage: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  messageBubbleInverseImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  messageBubbleReplyCustomer: { backgroundColor: '#e4e4e4' },
  messageBubbleInner: {
    borderRadius: 'inherit',
    maxWidth: '100%',
  },
});
