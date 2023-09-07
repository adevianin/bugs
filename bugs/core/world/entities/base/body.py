from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size

class Body():

    MAX_HP = 100
    RESTORE_HP_PER_STEP = 1
    SIZE = Size(32, 32)

    def __init__(self, events: EventEmitter, position: Point, angle: int, hp: int):
        self.events = events
        self._position = position
        self._angle = angle
        self._hp = hp

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

    def receive_damage(self, damage: int):
        if not self.is_died:
            self.hp -= damage if self.hp > damage else self.hp

        return self.is_died
    
    def restore_hp_step(self):
        if self.hp < self.MAX_HP:
            self.hp += self.RESTORE_HP_PER_STEP