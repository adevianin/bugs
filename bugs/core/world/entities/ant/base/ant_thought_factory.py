from core.world.entities.base.live_entity.live_entity_thought_factory import LiveEntityThoughtFactory
from .ant_body import AntBody
from core.world.entities.map import Map
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from .thoughts.searching_walk_thought import SearchingWalkThought
from .thoughts.find_entity_by_type_thought import FindEntityByTypeThought
from .thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.base.live_entity.memory import Memory
from .thoughts.find_food_thought import FindFoodThought
from .thoughts.feed_myself_thought import FeedMyselfThought
from .thoughts.prepare_for_opertation_thought import PrepareForOperationThought

class AntThoughtFactory(LiveEntityThoughtFactory):

    def __init__(self, body: AntBody, map: Map) -> None:
        super().__init__(body)
        self._map = map

    def build_searching_walk_thought(self, search_near_point: Point, search_radius: int) -> SearchingWalkThought:
        return SearchingWalkThought(self._body, self._map, search_near_point, search_radius)

    def build_find_entity_by_type_thought(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeThought:
        searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
        return FindEntityByTypeThought(self._body, entity_type, self._map, searching_walk_subthought)

    def build_collect_food_thought(self, nest: Nest, memory: Memory):
        find_food_thought = self.build_find_food_thought(memory, nest.position, nest.area)
        go_gome_thought = self.build_go_in_nest_thought(nest)
        return CollectFoodThought(self._body, nest, find_food_thought, go_gome_thought)
    
    def build_find_food_thought(self, memory: Memory, search_near_point: Point, search_radius: int):
        searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
        return FindFoodThought(self._body, self._map, memory, searching_walk_subthought)
    
    def build_feed_myself_thought(self, home: Nest, memory: Memory):
        find_food_thought = self.build_find_food_thought(memory, home.position, home.area)
        go_gome_thought = self.build_go_in_nest_thought(home)
        return FeedMyselfThought(self._body, home, find_food_thought, go_gome_thought)

    def build_prepare_for_operation_thought(self, home: Nest, memory: Memory, assemble_point: Point, sayback: str):
        feed_myself_thought = self.build_feed_myself_thought(home, memory)
        return PrepareForOperationThought(self._body, feed_myself_thought, assemble_point, sayback)
