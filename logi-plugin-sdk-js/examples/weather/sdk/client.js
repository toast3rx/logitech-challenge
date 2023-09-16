import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';
import Library from './library.js';
import BufferManager from './buffers/buffer_manager.js';

class Client extends Library {
  constructor(initData) {
    super();
    this.initData = initData;
    this.responseCallbacks = new Map();
  }
  #PORT = 30009;
  #url = 'ws://localhost:';
  #token = 'token=top_secret_code';
  #ws = this.#connectToWebsocket();
  #bufferManager = new BufferManager(this, this.#ws);
  #msgId = 0;

  #getSocketUrl() {
    return `${this.#url}${this.#PORT}?${this.#token}`;
  }

  #connectToWebsocket() {
    const options = {
      WebSocket: WS, // custom WebSocket constructor
    };
    const socketURL = this.#getSocketUrl();
    return new ReconnectingWebSocket(socketURL, ['Logi_JSON'], options);
  }

  sendMessage = (type, obj, callback = undefined, timeOut = 10000) => {
    const id = this.#msgId++;
    const message = this._getProtoMessage(type, id, obj);

    if (callback) {
      const expirationTime = Date.now() + timeOut;
      const obj = { callback, expirationTime}
      this.responseCallbacks.set(id, obj);
    }

    try {
      this.#ws.send(message);
    } catch (e) {
      console.log('Something went wrong with send message', e);
    }
  };

  sendResponseMessage = (type, id, obj, err) => {
    const messageWithResponse = this._getProtoMessageWithResponse(type, id, obj, err);

    try {
      this.#ws.send(messageWithResponse);
      if (this.#bufferManager.isBufferingEnabled()) {
        this.#bufferManager.processEvent('ResponseInfo', { id });
      }
    } catch (e) {
      console.log('Something went wrong with send message', e);
    }
  };

  #clearExpiredCallbacks = () => {
    const time = Date.now();

    this.responseCallbacks.forEach((value, key) => {
      if (value.expirationTime < time) {
        value.callback(null, 10000, 'Response timed out.');
        this.responseCallbacks.delete(key);
      }
    });
  }

  init = () => {
    this.#ws.addEventListener('open', () => {
      this.sendMessage('PluginHello', this.initData);
    });

    this.#ws.addEventListener('message', (event) => {
      const msgObg = JSON.parse(event.data);

      if (msgObg.response) {
        if (msgObg.message) {
          if (this.responseCallbacks.has(msgObg.id)) {
            const obj = this.responseCallbacks.get(msgObg.id);
            obj.callback(msgObg.message, msgObg.response.code, msgObg.response.what);
            this.responseCallbacks.delete(msgObg.id);
          }
        }

        this.#clearExpiredCallbacks();
        return;
      }

      const arrayWithType = msgObg.message['@type'].split('.');
      const type = arrayWithType[arrayWithType.length - 1];

      if (this.#bufferManager.isBufferingEnabled()) {
        this.#bufferManager.processEvent(type, msgObg);
      } else {
        this.dispatchMessage(type, msgObg);
      }
    });

    this.#ws.addEventListener('error', (event) => {
      console.log('Error websocket', event);
    });

    this.#ws.addEventListener('close', (event) => {
      console.log('Close websocket', event);
    });
  };

  dispatchMessage(type, msgObg) {
    if (this.mapper.hasOwnProperty(type)) {
      this.mapper[type](msgObg, this.#ws);
    } else {
      console.log('This type is not supported in client', type);
    }
  }

  registerControls(controls) {
    this.#bufferManager.registerControls(controls);
  }

  registerBuffer(bufferName, buffer) {
    this.#bufferManager.registerBuffer(bufferName, buffer);
  }

  flushBuffer (bufferName) {
    this.#bufferManager.flushBuffer(bufferName);
  }

  flushAllBuffers () {
    this.#bufferManager.flushAllBuffers();
  }

  getWebSocketState = () => {
    return this.#ws.readyState;
  }
}

export default Client;