class BufferManager {
  #buffers = new Map();
  #controlsRegistry = new Map();
  #client;
  #handlers;
  #ws;

  constructor(client, ws) {
    this.#client = client;
    this.#ws = ws;

    this.#handlers = {
      ['UpdateAnalogControl']: (msg) => {
        return this.handleUpdateAnalogControl(msg);
      },
      ['ResponseInfo']: (msg, ws) => {
        return this.handleResponseInfo(msg, ws);
      },
    };
  }

  isBufferingEnabled() {
    return this.#controlsRegistry.size > 0;
  }

  registerControls(controls) {
    for (const [controlId, bufferName] of controls) {
      this.#controlsRegistry.set(controlId, bufferName);
    }
  }

  registerBuffer(bufferName, buffer) {
    buffer.setClient(this.#client);
    this.#buffers.set(bufferName, buffer);
  }

  processEvent(msgType, msgObj) {
    if (!this.#handlers.hasOwnProperty(msgType) || !this.#handlers[msgType](msgObj, this.#ws)) {
      this.#client.dispatchMessage(msgType, msgObj);
    }
  }

  handleUpdateAnalogControl({ id, message }) {
    if (this.#controlsRegistry.has(message.analogControlId)) {
      const bufferName = this.#controlsRegistry.get(message.analogControlId);
      if (this.#buffers.has(bufferName)) {
        this.#buffers.get(bufferName).onUpdateAnalogControl({ id, message });
        return true;
      }
    }

    return false;
  }

  handleResponseInfo({ id }, ws) {
    for (const [_, buffer] of this.#buffers) {
      buffer.onResponseInfo({ id }, ws);
    }

    return true;
  }

  flushBuffer (bufferName) {
    if (this.#buffers.has(bufferName)) {
      this.#buffers.get(bufferName).flushBuffer();
    }
  }

  flushAllBuffers () {
    for (const [_, buffer] of this.#buffers) {
      buffer.flushBuffer();
    }
  }

}

export default BufferManager;
