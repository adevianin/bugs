from core.world.entities.base.live_entity import TaskFactory
from ..body import BugBody
from .searching_walk_task import SearchingWalkTask
from core.world.map import Map
from .find_entity_by_type_task import FindEntityByTypeTask
from core.world.entities.entity_types import EntityTypes
from .find_and_eat_task import FindAndEatTask
from core.world.utils.point import Point

class BugTaskFactory(TaskFactory):

    def __init__(self, body: BugBody, map: Map) -> None:
        super().__init__(body)
        self._map = map

    def build_searching_walk_task(self, search_near_point: Point = None, search_radius: int = None) -> SearchingWalkTask:
        return SearchingWalkTask(self._body, self._map, search_near_point, search_radius)

    def build_find_entity_by_type_task(self, entity_type: EntityTypes) -> FindEntityByTypeTask:
        searching_walk_subtask = self.build_searching_walk_task()
        return FindEntityByTypeTask(self._body, entity_type, self._map, searching_walk_subtask)

    def build_find_and_eat_task(self) -> FindAndEatTask:
        find_entity_by_type_task = self.build_find_entity_by_type_task(EntityTypes.FOOD)
        return FindAndEatTask(self._body, find_entity_by_type_task)
