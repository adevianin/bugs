from core.world.entities.base.live_entity import Mind
from .tasks.task_factory import BugTaskFactory
from .body import BugBody
from core.world.map import Map

class BugMind(Mind):

    def __init__(self, body: BugBody, task_factory: BugTaskFactory, map: Map, town_id: int):
        super().__init__(body, task_factory, map)
        self._town_id = town_id

    def _generate_tasks(self):
        return self._task_factory.build_find_and_eat_task()