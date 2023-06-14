from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes

class Colony:

    def __init__(self, id: int, event_bus: EventEmitter, owner_id: int, nests: list[Nest], ants: list[Ant]):
        self._id = id
        self._event_bus = event_bus
        self._owner_id = owner_id
        self._nests = nests
        self._ants = ants

    @property
    def owner_id(self):
        return self._owner_id
    
    def to_json(self):
        return {
            'id': self._id,
            'owner_id': self._owner_id
        }
    
    def get_nest_by_id(self, nest_id: int):
        for nest in self._nests:
            if nest.id == nest_id:
                return nest
        return None
    
    def get_queen(self):
        for ant in self._ants:
            if ant.ant_type == AntTypes.QUEEN:
                return ant
            
        return None
        