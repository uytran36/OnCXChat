import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  room: {
    margin: 8,
    padding: 8,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,

    elevation: 4,
  },
  roomPressed: {
    backgroundColor: '#cccccc',
  },
  avatarContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 0.8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerTilteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.68,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#02d302',
    marginLeft: 4,
  },
  offline: {
    backgroundColor: '#d9d9d9',
  },
  time: {
    position: 'absolute',
    right: 0,
  },
  pageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingRight: 12,
  },
  pageName: {
    color: '#258cf3',
    fontWeight: '500',
    marginLeft: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  message: {
    color: '#8c8c8c',
  },
  shorterMessage: {
    flex: 0.92,
  },
  unReadMessage: {
    color: '#000',
    fontWeight: '600',
  },
  numberUnReadContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  numberUnRead: {
    color: 'white',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  acceptForwardBtn: {
    backgroundColor: '#f25757',
    padding: 4,
    borderRadius: 4,
  },
  acceptForwardText: {
    color: 'white',
  },
  denyForwardBtn: {
    backgroundColor: 'white',
    marginLeft: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
  },
  denyForwardText: {
    color: 'black',
  },
  acceptBtn: {
    backgroundColor: '#258cf3',
    padding: 4,
    borderRadius: 4,
  },
  acceptText: {
    color: 'white',
  },
  btnPressed: {
    backgroundColor: '#cccccc',
  },
});
