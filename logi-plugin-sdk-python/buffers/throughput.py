import os
from buffer import Buffer

class ThroughputBuffer(Buffer):
    def __init__(self):
        super.__init__()
        self.__controls = {}
        
    def flushBuffer(self):
        for key, msgObj in self.__controls.items():
            if msgObj['message']['delta'] or msgObj['message']['value']:
                self._client.dispatchMessage('UpdateAnalogControl', msgObj)
        self.__controls.clear()
    
    def onUpdateAnalogControl(self, id, message):
        controlKey = self.__keyForAnalogControl(message)
        if controlKey in self.__controls:
            self.__accumulateToControlWithKey(message, controlKey)
            self.client.sendResponseMessage('ResponseInfo', id, {'code': 1, 'what': ''})
        else:
            control = {
                'analogControlId': message['analogControlId'],
                'configuration': message['configuration'],
                'instanceId': message['instanceId']
            }
            self.__controls[controlKey] = {'id': id, 'message': control}
            self.client.dispatchMessage('UpdateAnalogControl', {'id': id, 'message': message})
            
    def onResponseInfo(self, id):
         for key, msgObj in list(self.__controls.items()):
            if msgObj['id'] == id:
                if msgObj['message']['delta'] or msgObj['message']['value']:
                    self.client.dispatchMessage('UpdateAnalogControl', msgObj)
                del self.__controls[key]
                break
            
    def __accumulateToControlWithKey(self, control, key):
        registeredControl = self.__controls[key]['message']
        
        if registeredControl['value'] and control['delta']:
            registeredControl['value'] += control['delta']
        elif control['value']:
            registeredControl['delta'] = None
            registeredControl['value'] = control['value']
        elif registeredControl['delta']:
            registeredControl['delta'] += control['delta']
        else:
            registeredControl['delta'] = control['delta']
        
        if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'development':
            print('Buffered data:', registeredControl)
        
        self.__controls[key] = {'id': self.controls[key]['id'], 'message': registeredControl}
        
    def __keyForAnalogControl(control):
        configurationSuffix = '-' + control['configuration'] if control['configuration'] else ''
        return control['analogControlId'] + configurationSuffix
        