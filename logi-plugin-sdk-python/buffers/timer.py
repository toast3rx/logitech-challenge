from library import Library
import threading, os

class TimerBuffer(Buffer):
    def __init__(self, timeInterval = 100):
        super.__init__()
        self.__controls = {}
        self.__isTimerRunning = False
        self.__intervalId = None
        self.__timeInterval = timeInterval
        
    def flushBuffer(self):
        for key, msgObj in self.__controls.items():
            if msgObj['message']['delta'] or msgObj['message']['value']:
                self.client.dispatchMessage('UpdateAnalogControl', msgObj)

        self.__controls.clear()
        
    def onUpdateAnalogControl(self, id, message):
        controlKey = self.keyForAnalogControl(message)
        if controlKey in self.__controls:
            self.accumulateToControWithKey(message, controlKey)
            self.client.sendResponseMessage('ResponseInfo', id)
        else:
            control = {
                'analogControlId': message['analogControlId'],
                'configuration': message['configuration'],
                'instanceId': message['instanceId']
            }
            
            self.__controls[controlKey] = {'id': id, 'message': control}

            self.client.dispatchMessage('UpdateAnalogControl', {'id': id, 'message': message})

            if not self.is_timer_running:
                self.isTimerRunning = True
                self.intervalId = threading.Timer(self.timeInterval / 1000, self.timerCheckpointCallback)
                self.intervalId.start()
                
    def timerCheckpointCallback(self):
        if not self.__controls:
            self.isTimerRunning = False
            self.intervalId = None
        else:
            self.flushBuffer()
            self.intervalId = threading.Timer(self.timeInterval / 1000, self.timerCheckpointCallback)
            self.intervalId.start()
            
    def accumulateToControlWithKey(self, control, key):
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

        self.controls[key] = {'id': self.__controls[key]['id'], 'message': registeredControl}
        
    def keyForAnalogControl(self, control):
        return control['analogControlId'] + ('-' + control['configuration'] if control['configuration'] else '')