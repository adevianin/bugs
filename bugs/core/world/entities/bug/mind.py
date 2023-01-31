from core.world.entities.base.live_entity import Mind
from .tasks.task_factory import BugTaskFactory
from .body import BugBody
from core.world.map import Map
from core.world.entities.town import Town

class BugMind(Mind):

    def __init__(self, body: BugBody, task_factory: BugTaskFactory, map: Map, home_town: Town):
        super().__init__(body, task_factory, map)
        self._home_town = home_town

    def _generate_tasks(self):
        return self._task_factory.build_searching_walk_task(self._home_town.position, self._home_town.area)