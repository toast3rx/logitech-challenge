import Library from '../library.js';

class Buffer extends Library {
  constructor () {
    super();
    this._client = null;
  }

  setClient(client) {
    this._client = client;
  }

  flushBuffer() { }
}

export default Buffer;
