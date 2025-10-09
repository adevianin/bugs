from pyee.asyncio import AsyncIOEventEmitter

_container = {}

class EventBus(AsyncIOEventEmitter):
    pass

def register_event_bus(eb):
    _container['instance'] = eb

def get_event_bus() -> EventBus:
    return _container['instance']
