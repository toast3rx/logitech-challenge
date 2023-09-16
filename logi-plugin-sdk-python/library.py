from logi_plugin_pb2 import Envelope
from logi_plugin_pb2 import ManagerHello
from logi_plugin_pb2 import PluginActionConfigurationSchemeResponse
from logi_plugin_pb2 import PluginHello
from logi_plugin_pb2 import Pong
from logi_plugin_pb2 import ResponseInfo
from logi_plugin_pb2 import RetryAfter
from logi_plugin_pb2 import ReleaseAction
from logi_plugin_pb2 import VisibilityChanged
from logi_plugin_pb2 import UpdateAnalogControl
from logi_plugin_pb2 import Settings
from logi_plugin_pb2 import LogEvent
from logi_plugin_pb2 import SetData
from logi_plugin_pb2 import GetData
from logi_plugin_pb2 import WipeData
from logi_plugin_pb2 import SavedData
from logi_plugin_pb2 import OauthResponse
from logi_plugin_pb2 import SettingsRequest
from logi_plugin_pb2 import GetAnalogControlValue
from logi_plugin_pb2 import AnalogControlStatus
from logi_plugin_pb2 import ActionCellStatus
from logi_plugin_pb2 import UserInfo
from logi_plugin_pb2 import InitLogin
from logi_plugin_pb2 import Logout
from logi_plugin_pb2 import AnalogControlStatusList
from logi_plugin_pb2 import VisibilityChangedList
from logi_plugin_pb2 import GetUserInfoList
from logi_plugin_pb2 import GetActionStatus
from logi_plugin_pb2 import ActionStatusList
from logi_plugin_pb2 import ActionStatus
import json

class Library:
    def __init__(self):
        self.mapper = {
        'ManagerHello': self.onHello,
            'Ping': self.onPing,
            'TriggerAction': self.onTriggerAction,
            'PluginActionConfigurationSchemeRequest': self.onPluginActionConfigurationSchemeRequest,
            'PluginActionConfigurationResponse': self.onPluginActionConfigurationResponse,
            'RetryAfter': self.onRetryAfter,
            'ReleaseAction': self.onReleaseAction,
            'VisibilityChanged': self.onVisibilityChanged,
            'UpdateAnalogControl': self.on_updateAnalogControl,
            'Settings': self.onSettings,
            'SavedData': self.onSavedData,
            'OauthResponse': self.onOauthResponse,
            'GetAnalogControlValue': self.onGetAnalogControlValue,
            'InitLogin': self.on_initLogin,
            'Logout': self.oLogout,
            'ResponseInfo': self.onResponseInfo,
            'AnalogControlStatus': self.onAnalogControlStatus,
            'AnalogControlStatusList': self.onAnalogControlStatusList,
            'VisibilityChangedList': self.onVisibilityChangedList,
            'ActionCellStatus': self.onActionCellStatus,
            'UserInfo': self.onUserInfo,
            'PluginActionConfigurationSchemeResponse': self.onPluginActionConfigurationSchemeResponse,
            'GetUserInfoList': self.onGetUserInfoList,
            'GetActionStatus': self.onGetActionStatus,
            'ActionStatusList': self.onActionStatusList,
            'ActionStatus': self.onActionStatus
        }

    __getProto = lambda type, obj: (
    {
        'Envelope': lambda obj: Envelope(obj),
        'PluginHello': lambda obj: PluginHello(obj),
        'Pong': lambda obj: Pong(obj),
        'Settings': lambda obj: Settings(obj),
        'LogEvent': lambda obj: LogEvent(obj),
        'SetData': lambda obj: SetData(obj),
        'GetData': lambda obj: GetData(obj),
        'SettingsRequest': lambda obj: SettingsRequest(obj),
        'WipeData': lambda obj: WipeData(obj),
        'ResponseInfo': lambda obj: ResponseInfo(obj),
        'PluginActionConfigurationSchemeResponse': lambda obj: PluginActionConfigurationSchemeResponse(obj),
        'AnalogControlStatus': lambda obj: AnalogControlStatus(obj),
        'ActionCellStatus': lambda obj: ActionCellStatus(obj),
        'UserInfo': lambda obj: UserInfo(obj),
        'AnalogControlStatusList': lambda obj: AnalogControlStatusList(obj),
        'VisibilityChangedList': lambda obj: VisibilityChangedList(obj),
        'GetActionStatus': lambda obj: GetActionStatus(obj),
        'ActionStatusList': lambda obj: ActionStatusList(obj),
        'ActionStatus': lambda obj: ActionStatus(obj)
    }.get(type, lambda obj: None)(obj))

    getType = lambda obj, typeName: (
        {
            **obj,
            "@type": f"type.googleapis.com/logi.plugin.protocol.{typeName}"
        })

    __getProtoMessage = lambda self, protoName, messageId, obj={}: (
    protoMessage := self.getProto(protoName, obj),
    envelop := self.getProto('Envelope', {'id': messageId}),
    setattr(envelop, 'message', protoMessage),
    envelopObj := json.loads(envelop.toJsonString()),
    setattr(envelopObj, 'message', self.getType(protoMessage, protoName)),
    json.dumps(envelopObj))

    __getProtoMessageWithResponse = lambda self, protoName, messageId, obj={}, err={}: (
        envelop := self.getProto('Envelope', {'id': messageId}),
        envelopObj := json.loads(envelop.toJsonString()),
        setattr(envelopObj, 'message', self.getType(self.getProto(protoName, obj), protoName)) if protoName != 'ResponseInfo' else None,
        setattr(envelopObj, 'response', {'code': err['code'] if 'code' in err else 1, 'what': err['what'] if 'what' in err else ''}),
        json.dumps(envelopObj))

    def __defaultResponse(self, msg, ws):
        response = self.__getProtoMessageWithResponse('ResponseInfo', msg['id'], {}, {
            'code': -5,
            'what': 'Not Implemented'
        })
        try:
            ws.send(response)
        except Exception as e:
            print('Something went wrong with ResponseInfo', e)

    def onHello(self, msg):
        return

    def __onPing(self, msg, ws):
        response = self.__getProtoMessageWithResponse('Pong', msg['id'])
        try:
            ws.send(response)
        except Exception as e:
            print('Something went wrong with Pong', e)

    def onTriggerAction(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onPluginActionConfigurationSchemeRequest(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onPluginActionConfigurationResponse(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onRetryAfter(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onReleaseAction(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onVisibilityChanged(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onUpdateAnalogControl(self, msg, ws):
        self.defaultResponse(msg, ws)

    def onSettings(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onSavedData(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onOauthResponse(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onGetAnalogControlValue(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onInitLogin(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def on_logout(self, msg, ws):
        self.default_response(msg, ws)

    def onResponseInfo(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onAnalogControlStatus(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onAnalogControlStatusList(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onVisibilityChangedList(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onActionCellStatus(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onUserInfo(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onPluginActionConfigurationSchemeResponse(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onGetUserInfoList(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onGetActionStatus(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onActionStatusList(self, msg, ws):
        self.__defaultResponse(msg, ws)

    def onActionStatus(self, msg, ws):
        self.__defaultResponse(msg, ws)
