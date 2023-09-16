class BufferManager:
    def __init__(self, client, ws):
        self.buffers = {}
        self.controlsRegistry = {}
        self.client = client
        self.handlers = {
            'UpdateAnalogControl': lambda msg: self.handleUpdateAnalogControl(msg),
            'ResponseInfo': lambda msg, ws: self.handleResponseInfo(msg, ws)
        }
    
    def isBufferingEnabled(self):
        return len(self.controlsRegistry) > 0
    
    def registerControls(self, controls):
        for controlId, bufferName in controls.items():
            self.controlsRegistry[controlId] = bufferName
    
    def registerBuffer(self, bufferName, buffer):
        buffer.setClient(self.client)
        self.buffers[bufferName] = buffer
    
    def processEvent(self, msgType, msgObj):
        if msgType not in self.handlers or not self.handlers[msgType](msgObj, self.ws):
            self.client.dispatchMessage(msgType, msgObj)
    
    def handleUpdateAnalogControl(self, msg):
        if msg['message']['analogControlId'] in self.controlsRegistry:
            bufferName = self.controlsRegistry[msg['message']['analogControlId']]
            if bufferName in self.buffers:
                self.buffers[bufferName].onUpdateAnalogControl(msg['id'], msg['message'])
                return True
        return False
    
    def handleResponseInfo(self, msg, ws):
        for _, buffer in self.buffers.items():
            buffer.onResponseInfo(msg['id'], ws)