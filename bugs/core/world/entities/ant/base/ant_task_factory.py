from core.world.entities.base.live_entity.live_entity_task_factory import LiveEntityTaskFactory
from .ant_body import AntBody
from core.world.entities.map import Map
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from .tasks.searching_walk_task import SearchingWalkTask
from .tasks.find_entity_by_type_task import FindEntityByTypeTask
from .tasks.collect_food_task import CollectFoodTask
from core.world.entities.base.live_entity.memory import Memory
from .tasks.find_food_task import FindFoodTask
from .tasks.feed_myself_task import FeedMyselfTask
from .tasks.prepare_for_opertation_task import PrepareForOperationTask

class AntTaskFactory(LiveEntityTaskFactory):

    def __init__(self, body: AntBody, map: Map) -> None:
        super().__init__(body)
        self._map = map

    def build_searching_walk_task(self, search_near_point: Point, search_radius: int) -> SearchingWalkTask:
        return SearchingWalkTask(self._body, self._map, search_near_point, search_radius)

    def build_find_entity_by_type_task(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeTask:
        searching_walk_subtask = self.build_searching_walk_task(search_near_point, search_radius)
        return FindEntityByTypeTask(self._body, entity_type, self._map, searching_walk_subtask)

    def build_collect_food_task(self, nest: Nest, memory: Memory):
        find_food_task = self.build_find_food_task(memory, nest.position, nest.area)
        go_gome_task = self.build_go_in_nest_task(nest)
        return CollectFoodTask(self._body, nest, find_food_task, go_gome_task)
    
    def build_find_food_task(self, memory: Memory, search_near_point: Point, search_radius: int):
        searching_walk_subtask = self.build_searching_walk_task(search_near_point, search_radius)
        return FindFoodTask(self._body, self._map, memory, searching_walk_subtask)
    
    def build_feed_myself_task(self, home: Nest, memory: Memory):
        find_food_task = self.build_find_food_task(memory, home.position, home.area)
        go_gome_task = self.build_go_in_nest_task(home)
        return FeedMyselfTask(self._body, home, find_food_task, go_gome_task)

    def build_prepare_for_operation_task(self, home: Nest, memory: Memory, assemble_point: Point):
        feed_myself_task = self.build_feed_myself_task(home, memory)
        return PrepareForOperationTask(self._body, feed_myself_task, assemble_point)
