from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.live_entity.body import Body
from core.world.entities.item.item_source import ItemSource
from core.world.entities.item.item_types import ItemTypes
from core.world.entities.base.entity_types import EntityTypes

from typing import List, Callable

class GroundBeetleBody(Body):

    DISTANCE_PER_SEP = 32
    SIGHT_DISTANCE = 200

    def __init__(self, events: EventEmitter, memory: Memory, dna_profile: str, position: Point, hp: int, world_interactor: WorldInteractor):
        super().__init__(events, memory, dna_profile, position, hp, world_interactor)

    def look_around_for_honeydew_food_sources(self) -> List[ItemSource]:
        honeydew_filter: Callable[[ItemSource], bool] = lambda item_source: item_source.item_type == ItemTypes.HONEYDEW
        return self.look_around(types_list=[EntityTypes.ITEM_SOURCE], filter=honeydew_filter)

    def eat_aphid(self, honeydew_item_source: ItemSource):
        if honeydew_item_source.item_type != ItemTypes.HONEYDEW:
            raise Exception('is is not aphid')
        
        honeydew_item_source.damage(10)