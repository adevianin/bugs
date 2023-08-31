from core.world.entities.items.base.item_source import ItemSource
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.items.base.item_types import ItemTypes
from typing import Callable
import random

class HoneydewItemSource(ItemSource):

    @property
    def is_fertile(self):
        return self.hp > self.MAX_HP / 3
    
    def take_some_item(self, on_honeydew_ready: Callable) -> bool:
        min_caloric_value = min(self._fertility * 2, self._accumulated)
        max_caloric_value = min(self._fertility * 6, self._accumulated)
        calories = random.randint(min_caloric_value, max_caloric_value)

        if calories == 0:
            return False

        self._accumulated -= calories

        self.events.emit('birth_request', {
            'entity_type': EntityTypes.ITEM,
            'item_type': ItemTypes.HONEYDEW,
            'position': self._position,
            'calories': calories,
            'callback': on_honeydew_ready
        })

        return True