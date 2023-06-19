from .entity import Entity
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .entity_types import EntityTypes
 
class PlainEntity(Entity):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, from_colony: int, position: Point):
        super().__init__(event_bus, id, type, from_colony)
        self._position = position
        self._is_entity_busy = False

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, new_pos: Point):
        self._position = new_pos

    def do_step(self):
        return super().do_step()

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'position': {
                'x': self._position.x,
                'y': self._position.y
            }
        })
        
        return json
    
    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'position': self._position
        })
        
        return json
