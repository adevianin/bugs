from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.entity_types import EntityTypes

from typing import List, Callable

class GroundBeetleBody(LiveBody):

    def look_around_for_honeydew_food_sources(self) -> List[ItemSource]:
        honeydew_filter: Callable[[ItemSource], bool] = lambda item_source: item_source.item_type == ItemTypes.HONEYDEW
        return self.look_around(types_list=[EntityTypes.ITEM_SOURCE], filter=honeydew_filter)

    def eat_aphid(self, honeydew_item_source: ItemSource):
        if honeydew_item_source.item_type != ItemTypes.HONEYDEW:
            raise Exception('is is not aphid')
        
        honeydew_item_source.body.receive_damage(10)