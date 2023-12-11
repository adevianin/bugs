from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.body import Body

class ItemSourceBody(Body):

    RESTORE_HP_PER_STEP = 0.05

    def receive_damage(self, damage: int):
        if damage >= self._hp or self._hp < self.MAX_HP / 2:
            self.hp = 1
        else:
            super().receive_damage(damage)