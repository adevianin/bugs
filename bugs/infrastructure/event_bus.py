from pyee import EventEmitter

_container = {}

class EventBus(EventEmitter):
    pass

def register_event_bus(eb):
    _container['instance'] = eb

def get_event_bus() -> EventBus:
    return _container['instance']
