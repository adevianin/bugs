from core.world.utils.event_emiter import EventEmitter

class Colony:

    def __init__(self, id: int, event_bus: EventEmitter, owner_id: int):
        self._id = id
        self._event_bus = event_bus
        self._owner_id = owner_id

    @property
    def id(self):
        return self._id

    @property
    def owner_id(self):
        return self._owner_id
    
    def to_json(self):
        return {
            'id': self._id,
            'owner_id': self._owner_id
        }
        