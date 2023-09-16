import Buffer from './buffer.js';

class TimerBuffer extends Buffer {
  #controls = new Map();
  #isTimerRunning = false;
  #intervalId = null;
  #timeInterval = null;

  constructor(timeInterval = 100) {
    super();
    this.#timeInterval = timeInterval;
  }
  
  flushBuffer() {
    for (const [key, msgObj] of this.#controls) {
      if (msgObj.message.delta || msgObj.message.value) {
        this._client.dispatchMessage('UpdateAnalogControl', msgObj);
      }
    }

    this.#controls.clear();
  }

  onUpdateAnalogControl({ id, message }) {
    const controlKey = this.#keyForAnalogControl(message);
    if (this.#controls.has(controlKey)) {
      this.#accumulateToControlWithKey(message, controlKey);
      this._client.sendResponseMessage('ResponseInfo', id);
    } else {
      const control = {
        analogControlId: message.analogControlId,
        configuration: message.configuration,
        instanceId: message.instanceId,
      };

      this.#controls.set(controlKey, { id: id, message: control });

      this._client.dispatchMessage('UpdateAnalogControl', { id, message });

      if (!this.#isTimerRunning) {
        this.#isTimerRunning = true;
        this.#intervalId = setInterval(this.#timerCheckpointCallback.bind(this), this.#timeInterval);
      }
    }
  }

  #timerCheckpointCallback() {
    if (this.#controls.size === 0) {
      clearInterval(this.#intervalId);
      this.#isTimerRunning = false;
    }

    this.flushBuffer();
  }

  #accumulateToControlWithKey(control, key) {
    let registeredControl = this.#controls.get(key).message;

    if (registeredControl.value && control.delta) {
      registeredControl.value += control.delta;
    } else if (control.value) {
      registeredControl.delta = undefined;
      registeredControl.value = control.value;
    } else if (registeredControl.delta) {
      registeredControl.delta += control.delta;
    } else {
      registeredControl.delta = control.delta;
    }

    process.env.NODE_ENV === 'development' && console.log('Buffered data: ', registeredControl);

    this.#controls.set(key, { id: this.#controls.get(key).id, message: registeredControl });
  }

  #keyForAnalogControl(control) {
    return control.analogControlId + (control.configuration ? '-' + control.configuration : '');
  }
}

export default TimerBuffer;
