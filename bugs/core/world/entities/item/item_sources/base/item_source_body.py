from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.base.body import Body
from core.world.exceptions import GameError

class ItemSourceBody(Body):

    MIN_ITEM_STRENGTH = 100

    def __init__(self, events, stats, position, angle, hp, fertility: int, accumulated: int, max_item_strength: int, is_active: bool):
        super().__init__(events, stats, position, angle, hp)
        self._fertility = fertility
        self._accumulated = accumulated 
        self._max_item_strength = max_item_strength
        self._is_active = is_active
        self._max_accumulated = 30 * self._fertility
        self._is_damaged = self._check_is_damaged()

    @property
    def max_item_strength(self):
        return self._max_item_strength

    @property
    def is_damaged(self):
        return self._is_damaged
    
    @property
    def accumulated(self):
        return self._accumulated

    @accumulated.setter
    def accumulated(self, val: int):
        if self._accumulated != val:
            self._accumulated = val
            self.events.emit('accumulated_changed')

    @property
    def max_accumulated(self):
        return self._max_accumulated
    
    @property
    def is_active(self):
        return self._is_active
    
    @is_active.setter
    def is_active(self, val):
        self._is_active = val
        if not val:
            self.accumulated = 0

    @property
    def fertility(self):
        return self._fertility

    def produce(self):
        if not self._is_damaged and self._is_active and self._accumulated < self._max_accumulated:
            self.accumulated = min(self._accumulated + self._fertility, self._max_accumulated)

    def check_can_pull_item_strength(self) -> bool:
        return self._accumulated >= ItemSourceBody.MIN_ITEM_STRENGTH

    def pull_item_strength(self) -> int:
        strength = min(self._max_item_strength, self._accumulated)
        # strength = random.randint(ItemSourceBody.MIN_ITEM_STRENGTH, int(max_strength))
        if strength > self._accumulated:
            raise GameError('cant pull item with such strength')
        self._accumulated -= strength
        return strength

    def _update_is_damaged_state(self):
        updated_is_damaged = self._check_is_damaged()
        if self._is_damaged != updated_is_damaged:
            self._is_damaged = updated_is_damaged
            self.events.emit('is_damaged_changed')

    def _check_is_damaged(self):
        return self.hp < self.stats.max_hp / 3
    
    def receive_damage(self, damage: int, damage_type: DamageTypes):
        if damage >= self._hp or self._hp < self.stats.max_hp / 2:
            self.hp = 1
            self.accumulated = 0
        else:
            super().receive_damage(damage, damage_type)

        self._update_is_damaged_state()

    def restore_hp_step(self):
        super().restore_hp_step()
        self._update_is_damaged_state()
