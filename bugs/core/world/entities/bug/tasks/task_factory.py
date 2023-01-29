from core.world.entities.base.live_entity import TaskFactory
from ..body import BugBody
from .searching_walk_task import SearchingWalkTask
from core.world.map import Map

class BugTaskFactory(TaskFactory):

    def __init__(self, body: BugBody, map: Map) -> None:
        super().__init__(body)
        self._map = map

    def build_searching_walk_task(self) -> SearchingWalkTask:
        return SearchingWalkTask(self._body, self._map)
