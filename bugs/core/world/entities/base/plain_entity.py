from .entity import Entity
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from ..entity_types import EntityTypes
 
class PlainEntity(Entity):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, position: Point):
        super().__init__(event_bus, id, type)
        self._position = position

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, new_pos: Point):
        self._position = new_pos

    def to_json(self):
        json = super().to_json()
        json.update({
            'position': {
                'x': self._position.x,
                'y': self._position.y
            }
        })
        
        return json
