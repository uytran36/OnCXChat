import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Pressable,
  Text,
  Modal,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const MessageAttachments = ({ attachments, id, isMe }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [initIndex, setInitIndex] = useState(0);

  const replacePayloadURL = str => {
    if (!str) return '';
    else {
      if (
        str[0] === 'h' &&
        str[1] === 't' &&
        str[2] === 't' &&
        str[3] === 'p' &&
        str[4] !== 's'
      )
        return str.substring(0, 4) + 's' + str.substring(4, str.length);
      else return str;
    }
  };

  const imagesToShow = useMemo(() => {
    const _imagesToShow = [];
    let temp = [];
    if (!Array.isArray(attachments)) {
      return [];
    }
    // số ảnh ít nhất trên 1 hàng là 1
    // số ảnh nhiều nhất trên 1 hàng là 3
    attachments.forEach((img, index) => {
      if (temp.length <= 3) {
        temp.push(img);
      }
      if (index === attachments.length - 1 || temp.length === 3) {
        _imagesToShow.push([...temp]);
        temp = [];
      }
    });
    return _imagesToShow;
  }, [attachments]);

  const renderOne = image => {
    return (
      <View style={styles.imgOneWrapper}>
        <Pressable
          onPress={() => {
            setDataModal([
              {
                url: replacePayloadURL(image.payloadUrl),
              },
            ]);
            setIsVisible(true);
          }}
          style={styles.pressable}>
          <Image
            style={styles.img}
            source={{ uri: replacePayloadURL(image.payloadUrl) }}
          />
        </Pressable>
      </View>
    );
  };

  const renderTwo = _images => {
    return (
      <View style={styles.imgTwoWrapper}>
        {_images.map((img, index) => (
          <Pressable
            onPress={() => {
              setDataModal(
                _images.map(image => ({
                  url: replacePayloadURL(image.payloadUrl),
                })),
              );
              setInitIndex(index);
              setIsVisible(true);
            }}
            key={index}
            style={styles.pressable}>
            <Image
              key={index}
              style={styles.imgTwo}
              source={{ uri: replacePayloadURL(img.payloadUrl) }}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  const renderThree = images => {
    return (
      <View style={styles.imgThreeWrapper}>
        {images.map((img, index) => (
          <Pressable
            onPress={() => {
              setDataModal(
                images.map(image => ({
                  url: replacePayloadURL(image.payloadUrl),
                })),
              );
              setInitIndex(index);
              setIsVisible(true);
            }}
            key={index}
            style={styles.pressable}>
            <Image
              key={index}
              style={styles.imgThree}
              source={{ uri: replacePayloadURL(img.payloadUrl) }}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  const renderImage =
    attachments &&
    ['image', 'sticker', 'gif'].includes(attachments[0]?.type) &&
    imagesToShow &&
    imagesToShow.map((imgs, index) => {
      return (
        <View key={index} id={id}>
          {[1].includes(imgs.length) && renderOne(imgs[0])}
          {[2, 4].includes(imgs.length) && renderTwo(imgs)}
          {imgs.length >= 3 && imgs.length !== 4 && renderThree(imgs)}
        </View>
      );
    });

  const videoError = err => {
    console.warn(err);
  };

  const renderVideo = attachments &&
    attachments[0]?.type?.includes('video') && (
      <View
        key={id}
        style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
        {/* <Video
          source={{ uri: replacePayloadURL(attachments[0]?.payloadUrl) }} // Can be a URL or a local file.
          onError={videoError} // Callback when video cannot be loaded
        /> */}
      </View>
    );

  return (
    <View>
      {renderImage}
      {/* {renderVideo} */}
      <Modal visible={isVisible} transparent={false}>
        <ImageViewer
          imageUrls={dataModal}
          index={initIndex}
          enableSwipeDown
          onSwipeDown={() => setIsVisible(false)}
          renderHeader={() => (
            <View style={styles.header}>
              <Pressable onPress={() => setIsVisible(false)}>
                <EvilIcons
                  name="close"
                  size={24}
                  color="white"
                  style={{ alignSelf: 'flex-end' }}
                />
              </Pressable>
            </View>
          )}
        />
      </Modal>
    </View>
  );
};

MessageAttachments.propTypes = {
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

export default memo(MessageAttachments);

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: '100%',
  },
  imgOneWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 'inherit',
    marginTop: 4,
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimensions.get('window').width / 3 - 10,
    height: Dimensions.get('window').width / 3 - 10,
  },

  imgTwoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    width: 100,
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  imgThreeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    width: 40,
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgTwo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imgThree: { width: '100%', height: '100%', resizeMode: 'cover' },
  header: {
    textAlign: 'right',
  },
});
