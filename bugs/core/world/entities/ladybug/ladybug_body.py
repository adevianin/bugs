from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.tree.tree import Tree
from core.world.exceptions import GameError

from typing import List, Callable

class LadybugBody(LiveBody):

    HIBERNATION_THRESHOLD = 3

    def look_around_for_honeydew_food_sources(self) -> List[ItemSource]:
        honeydew_filter: Callable[[ItemSource], bool] = lambda item_source: item_source.item_type == ItemTypes.HONEYDEW
        return self.look_around(types_list=[EntityTypes.ITEM_SOURCE], filter=honeydew_filter)
    
    def look_aroung_for_trees(self) -> List[Tree]:
        return self.look_around(types_list=[EntityTypes.TREE])

    def eat_aphid(self, honeydew_item_source: ItemSource):
        if honeydew_item_source.item_type != ItemTypes.HONEYDEW:
            raise GameError('is is not aphid')
        
        self.damage_another_body(honeydew_item_source.body)
