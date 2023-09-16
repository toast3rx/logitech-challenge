from library import Library

class Buffer(Library):
    def __init__(self):
        super().__init__()
        self.client = None
        
    def setClient(self, client):
        self.client = client
        
    def flushBuffer():
        return
        