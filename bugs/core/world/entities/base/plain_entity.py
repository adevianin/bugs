from .entity import Entity
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .entity_types import EntityTypes
 
class PlainEntity(Entity):

    def __init__(self, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, hp: int, position: Point, angle: int):
        super().__init__(events, id, type, from_colony_id)
        self._position = position
        self._hp = hp
        self._angle = angle

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, new_pos: Point):
        self._position = new_pos
        self.events.emit('position_changed')

    @property
    def angle(self):
        return self._angle

    @angle.setter
    def angle(self, value: int):
        self._angle = value
        self.events.emit('angle_changed')

    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, hp: int):
        self._hp = hp
        self.events.emit('hp_changed')

    def do_step(self):
        return super().do_step()
