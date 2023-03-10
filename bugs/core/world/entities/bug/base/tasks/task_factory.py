from core.world.entities.base.live_entity.tasks.task_factory import TaskFactory
from ..bug_body import BugBody
from core.world.map import Map
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.point import Point
from core.world.entities.town import Town
from .searching_walk_task import SearchingWalkTask
from .find_and_eat_task import FindAndEatTask
from .find_entity_by_type_task import FindEntityByTypeTask
from .collect_food_task import CollectFoodTask
from core.world.entities.base.live_entity.memory import Memory
from .find_food_task import FindFoodTask
from .go_home_to_eat_task import GoHomeToEatTask

class BugTaskFactory(TaskFactory):

    def __init__(self, body: BugBody, map: Map) -> None:
        super().__init__(body)
        self._map = map

    def build_searching_walk_task(self, search_near_point: Point, search_radius: int) -> SearchingWalkTask:
        return SearchingWalkTask(self._body, self._map, search_near_point, search_radius)

    def build_find_entity_by_type_task(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeTask:
        searching_walk_subtask = self.build_searching_walk_task(search_near_point, search_radius)
        return FindEntityByTypeTask(self._body, entity_type, self._map, searching_walk_subtask)

    # def build_find_and_eat_task(self) -> FindAndEatTask:
    #     find_entity_by_type_task = self.build_find_entity_by_type_task(EntityTypes.FOOD)
    #     return FindAndEatTask(self._body, find_entity_by_type_task)

    def build_collect_food_task(self, town: Town, memory: Memory):
        find_food_task = self.build_find_food_task(memory, town.position, town.area)
        return CollectFoodTask(self._body, town, find_food_task)
    
    def build_find_food_task(self, memory: Memory, search_near_point: Point, search_radius: int):
        searching_walk_subtask = self.build_searching_walk_task(search_near_point, search_radius)
        return FindFoodTask(self._body, self._map, memory, searching_walk_subtask)
    
    def build_go_home_to_eat_task(self, home: Town):
        return GoHomeToEatTask(self._body, home)
