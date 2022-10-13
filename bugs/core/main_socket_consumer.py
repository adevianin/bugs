from channels.generic.websocket import WebsocketConsumer

class MainSocketConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self):
        pass