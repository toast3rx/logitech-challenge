import {
  Envelope,
  ManagerHello,
  PluginActionConfigurationSchemeResponse,
  PluginHello,
  Pong,
  ResponseInfo,
  RetryAfter,
  ReleaseAction,
  VisibilityChanged,
  UpdateAnalogControl,
  Settings,
  LogEvent,
  SetData,
  GetData,
  WipeData,
  SavedData,
  OauthResponse,
  SettingsRequest,
  GetAnalogControlValue,
  AnalogControlStatus,
  ActionCellStatus,
  UserInfo,
  InitLogin,
  Logout,
  AnalogControlStatusList,
  VisibilityChangedList,
  GetUserInfoList,
  GetActionStatus,
  ActionStatusList,
  ActionStatus
} from './schema/logi_plugin_pb.js';

class Library {
  constructor() {
    this.mapper = {
      ['ManagerHello']: (msg) => {
        this.onHello(msg);
      },
      ['Ping']: (msg, ws) => {
        this.#onPing(msg, ws);
      },
      ['TriggerAction']: (msg, ws) => {
        this.onTriggerAction(msg, ws);
      },
      ['PluginActionConfigurationSchemeRequest']: (msg, ws) => {
        this.onPluginActionConfigurationSchemeRequest(msg, ws);
      },
      ['PluginActionConfigurationResponse']: (msg, ws) => {
        this.onPluginActionConfigurationResponse(msg, ws);
      },
      ['RetryAfter']: (msg, ws) => {
        this.onRetryAfter(msg, ws);
      },
      ['ReleaseAction']: (msg, ws) => {
        this.onReleaseAction(msg, ws);
      },
      ['VisibilityChanged']: (msg, ws) => {
        this.onVisibilityChanged(msg, ws);
      },
      ['UpdateAnalogControl']: (msg, ws) => {
        this.onUpdateAnalogControl(msg, ws);
      },
      ['Settings']: (msg, ws) => {
        this.onSettings(msg, ws);
      },
      ['SavedData']: (msg, ws) => {
        this.onSavedData(msg, ws);
      },
      ['OauthResponse']: (msg, ws) => {
        this.onOauthResponse(msg, ws);
      },
      ['GetAnalogControlValue']: (msg, ws) => {
        this.onGetAnalogControlValue(msg, ws);
      },
      ['InitLogin']: (msg, ws) => {
        this.onInitLogin(msg, ws);
      },
      ['ResponseInfo']: (msg, ws) => {
        this.onResponseInfo(msg, ws);
      },
      ['Logout']: (msg, ws) => {
        this.onLogout(msg, ws);
      },
      ['AnalogControlStatus']: (msg, ws) => {
        this.onAnalogControlStatus(msg, ws);
      },
      ['AnalogControlStatusList']: (msg, ws) => {
        this.onAnalogControlStatusList(msg, ws);
      },
      ['VisibilityChangedList']: (msg, ws) => {
        this.onVisibilityChangedList(msg, ws);
      },
      ['ActionCellStatus']: (msg, ws) => {
        this.onActionCellStatus(msg, ws);
      },
      ['UserInfo']: (msg, ws) => {
        this.onUserInfo(msg, ws);
      },
      ['PluginActionConfigurationSchemeResponse']: (msg, ws) => {
        this.onPluginActionConfigurationSchemeResponse(msg, ws);
      },
      ['GetUserInfoList']: (msg, ws) => {
        this.onGetUserInfoList(msg, ws);
      },
      ['GetActionStatus']: (msg, ws) => {
        this.onGetActionStatus(msg, ws);
      },
      ['ActionStatusList']: (msg, ws) => {
        this.onActionStatusList(msg, ws);
      },
      ['ActionStatus']: (msg, ws) => {
        this.onActionStatus(msg, ws);
      },
    };
  }

  #getProto = (type, obj) => {
    switch (type) {
      case 'Envelope':
        return new Envelope(obj)
      case 'PluginHello':
        return new PluginHello(obj)
      case 'Pong':
        return new Pong(obj)
      case 'Settings':
        return new Settings(obj)
      case 'LogEvent':
        return new LogEvent(obj)
      case 'SetData':
        return new SetData(obj)
      case 'GetData':
        return new GetData(obj)
      case 'SettingsRequest':
        return new SettingsRequest(obj)
      case 'WipeData':
        return new WipeData(obj)
      case 'ResponseInfo':
        return new ResponseInfo(obj)
      case 'PluginActionConfigurationSchemeResponse':
        return new PluginActionConfigurationSchemeResponse(obj)
      case 'AnalogControlStatus':
        return new AnalogControlStatus(obj)
      case 'ActionCellStatus':
        return new ActionCellStatus(obj)
      case 'UserInfo':
        return new UserInfo(obj);
      case 'AnalogControlStatusList':
        return new AnalogControlStatusList(obj);
      case 'VisibilityChangedList':
        return new VisibilityChangedList(obj);
      case 'GetActionStatus':
        return new GetActionStatus(obj);
      case 'ActionStatusList':
        return new ActionStatusList(obj);
      case 'ActionStatus':
        return new ActionStatus(obj);
    }
  }

  getType = (obj, type) => {
    return {
      ...obj,
      "@type": `type.googleapis.com/logi.plugin.protocol.${type}`
    }
  };

  _getProtoMessage = (protoName, messageId,  obj= {}) => {
    const protoMessage = this.#getProto(protoName, obj);
    const envelop = this.#getProto('Envelope', {id: messageId});
    envelop.message = protoMessage;
    const envelopObj = JSON.parse(envelop.toJsonString());
    envelopObj.message = this.getType(protoMessage, protoName)

    return JSON.stringify(envelopObj);
  }

  _getProtoMessageWithResponse = (protoName, messageId, obj = {}, err = {}) => {
    const envelop = this.#getProto('Envelope', {id: messageId});
    const envelopObj = JSON.parse(envelop.toJsonString());
    if (protoName !== 'ResponseInfo') {
      const protoMessage = this.#getProto(protoName, obj);
      envelop.message = protoMessage;
      envelopObj.message = this.getType(protoMessage, protoName);
    }
    envelopObj.response = {
      code: (err.code) ? err.code : 1,
      what: (err.what) ? err.what : ''
    }
    return JSON.stringify(envelopObj);
  }

  #defaultResponse = (msg, ws) => {
    const response = this._getProtoMessageWithResponse('ResponseInfo', msg.id, {}, {
      code: -5,
      what: 'Not Implemented'
    });
    try {
      ws.send(response);
    } catch (e) {
      console.log('Something went wrong with ResponseInfo', e);
    }
  }

  #onPing(msg, ws) {
    const response = this._getProtoMessageWithResponse('Pong', msg.id);
    try {
      ws.send(response);
    } catch (e) {
      console.log('Something went wrong with Pong', e);
    }
  }

  onHello() {}

  onTriggerAction(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onPluginActionConfigurationSchemeRequest(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onPluginActionConfigurationResponse(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onRetryAfter(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onReleaseAction(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onVisibilityChanged(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onUpdateAnalogControl(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onSettings(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onSavedData(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onOauthResponse(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onGetAnalogControlValue(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onInitLogin(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onLogout(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onResponseInfo(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onAnalogControlStatus(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onAnalogControlStatusList(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onVisibilityChangedList(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onActionCellStatus(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onUserInfo(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onPluginActionConfigurationSchemeResponse(msg, ws) {
    this.#defaultResponse(msg, ws);
  }

  onGetUserInfoList(msg, ws) {
    this.#defaultResponse(msg, ws);
  }
  onGetActionStatus(msg, ws) {
    this.#defaultResponse(msg, ws);
  }
  onActionStatusList(msg, ws) {
    this.#defaultResponse(msg, ws);
  }
  onActionStatus(msg, ws) {
    this.#defaultResponse(msg, ws);
  }
}

export default Library;