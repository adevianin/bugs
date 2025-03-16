from pyee import EventEmitter

class EventBus(EventEmitter):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(EventBus, cls).__new__(cls, *args, **kwargs)
        return cls._instance
    
event_bus = EventBus()
