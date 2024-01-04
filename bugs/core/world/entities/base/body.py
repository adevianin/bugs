from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from .basic_stats import BasicStats
from core.world.entities.action.action_types import ActionTypes

class Body():

    SIZE = Size(32, 32)

    def __init__(self, events: EventEmitter, stats: BasicStats, position: Point, angle: int, hp: int):
        self.events = events
        self.stats = stats
        self._position = position
        self._angle = angle
        self._hp = hp or stats.max_hp

    @property
    def is_died(self):
        return self._hp == 0

    @property
    def position(self):
        return self._position
    
    @position.setter
    def position(self, value):
        self._position = value
        self.events.emit('position_changed')

    @property
    def angle(self):
        return self._angle
    
    @angle.setter
    def angle(self, value):
        self._angle = value
        self._emit_body_action(ActionTypes.ENTITY_ROTATED, { 'angle': self._angle })

    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, hp: int):
        self._hp = hp
        self._emit_body_action(ActionTypes.ENTITY_HP_CHANGED, { 'hp': self._hp })
        if self._hp <= 0:
            self._handle_dieing()

    def receive_damage(self, damage: int):
        if not self.is_died:
            self.hp -= damage if self.hp > damage else self.hp

        return self.is_died
    
    def restore_hp_step(self):
        if self.hp < self.stats.max_hp:
            self.hp += self.stats.hp_regen_rate

    def _handle_dieing(self):
        self._emit_body_action(ActionTypes.ENTITY_DIED)
        self.events.emit('died')
        self.events.emit('ready_to_remove')

    def _emit_body_action(self, action_type: ActionTypes, action_data: dict = None):
        self.events.emit('body_action', action_type, action_data)