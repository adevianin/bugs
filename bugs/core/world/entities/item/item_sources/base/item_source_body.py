from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.base.body import Body

class ItemSourceBody(Body):

    def receive_damage(self, damage: int, damage_type: DamageTypes):
        if damage >= self._hp or self._hp < self.stats.max_hp / 2:
            self.hp = 1
        else:
            super().receive_damage(damage, damage_type)