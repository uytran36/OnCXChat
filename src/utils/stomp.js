import { REACT_APP_WEBSOCKET_SSL } from '@env';
import { Client } from '@stomp/stompjs';

/**
 * @class SetupSocket
 */
export class SetupSocket {
  StompClient = null;
  isConnected = false;
  constructor() {
    const newClient = new Client();
    this.StompClient = newClient;
  }
  // private functions
  /**
   * @param {Function} handle
   * @returns {Function}
   */
  #handleParseJson(handle) {
    return message => {
      if (message && message.body) {
        const msg = JSON.parse(message.body);
        handle(msg);
      }
    };
  }

  // public functions
  onDisconnect() {
    if (this.StompClient) {
      this.StompClient.deactivate();
      this.isConnected = false;
    }
  }

  onConnect({
    username,
    token,
    dispatch,
    wsId,
    userId,
    agentUuid,
    ...configs
  }) {
    try {
      if (this.StompClient) {
        this.StompClient.configure({
          debug: str => {
            // console.log(new Date(), str);
          },
          connectHeaders: {
            Authorization: token,
          },
          reconnectDelay: 2000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          ...configs,
          brokerURL: `${REACT_APP_WEBSOCKET_SSL}/websocket-chat`,
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          beforeConnect: () => {
            this.isConnected = true;
          },
          // default connect...
          onConnect: () => {
            console.log('connected socket');
          },
          onStompError: frame => {
            console.log('Broker reported error: ' + frame.headers.message);
            console.log('Additional details: ' + frame.body);
          },
        });
        this.StompClient.activate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  getStatus() {
    return this.isConnected;
  }

  onWatchListRooms(_, onRefetchListRoom) {
    try {
      if (!this.StompClient) {
        throw 'ERROR #361';
      }
      if (!this.StompClient.connected) {
        throw 'ERROR #399';
      }
      const { unsubscribe } = this.StompClient.subscribe(
        `/topic/event-room`,
        this.#handleParseJson(onRefetchListRoom),
      );
      return {
        unsubscribe,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * @typedef {Object} OnWatchMessage
   * @property {Function} subscription.unsubscribe
   * @property {string} subscription.id
   * ____________________________________________
   * @param {Function} onRefetchListMessage
   * @param {string} nextRoomId
   * @param {string} username
   * @returns {OnWatchMessage}
   */
  onWatchMessages(onRefetchListMessage, { roomId }) {
    if (this.StompClient) {
      if (roomId && this.StompClient.connected) {
        const subscription = this.StompClient.subscribe(
          `/topic/new-message/${roomId}`,
          this.#handleParseJson(onRefetchListMessage),
          // {
          //   roomId,
          //   id: roomId,
          // },
        );
        return subscription;
      }
    }
  }

  /**
   * @typedef {Object} onWatchReadTimestamp
   * @property {Function} subscription.unsubscribe
   * @property {string} subscription.id
   * ____________________________________________
   * @param {Function} handle
   * @param {string} roomId
   * @returns {onWatchReadTimestamp}
   */
  onWatchReadTimestamp(handle, { roomId }) {
    if (this.StompClient) {
      if (roomId && this.StompClient.connected) {
        const subscription = this.StompClient.subscribe(
          `/topic/message-read/${roomId}`,
          this.#handleParseJson(handle),
          {
            roomId,
          },
        );
        return subscription;
      }
    }
  }

  onWatchRoomInfo(onRefetchRoomInfo) {
    if (this.StompClient) {
      if (this.StompClient.connected) {
        const subscription = this.StompClient.subscribe(
          `/topic/tag-in-room`,
          // onRefetchRoomInfo(),
          this.#handleParseJson(onRefetchRoomInfo),
          // {
          //   roomId,
          // },
        );
        return subscription;
      }
    }
  }

  onWatchLogAction(callback, { roomId }) {
    if (this?.StompClient?.connected && roomId) {
      const subscription = this.StompClient.subscribe(
        `/topic/log-room/${roomId}`,
        this.#handleParseJson(callback),
      );
      return subscription;
    }
  }
}

export const NewSetupSocket = new SetupSocket();
