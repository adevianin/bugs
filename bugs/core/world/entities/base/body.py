from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from .basic_stats import BasicStats

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
        self.events.emit('angle_changed')

    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, hp: int):
        self._hp = hp
        self.events.emit('hp_changed')
        if self._hp <= 0:
            self._die()

    def receive_damage(self, damage: int):
        if not self.is_died:
            self.hp -= damage if self.hp > damage else self.hp

        return self.is_died
    
    def restore_hp_step(self):
        if self.hp < self.stats.max_hp:
            self.hp += self.stats.hp_regen_rate

    def _die(self):
        self.events.emit('died')
        self.events.remove_all_listeners()