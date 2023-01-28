from abc import ABC, abstractclassmethod
from .body import Body
from .tasks.task_factory import TaskFactory
from core.world.map import Map

class Mind(ABC):

    def __init__(self, body: Body, task_factory: TaskFactory, map: Map):
        self._body = body
        self._task_factory = task_factory
        self._map = map
        self._current_task = None

    def do_step(self):
        while self._body.energy > 0:
            self._do_next_task()

    def _do_next_task(self):
        if not self._current_task:
            self._current_task = self._generate_tasks()

        self._current_task.do_step()

        if self._current_task.is_done():
            self._current_task = None

    @abstractclassmethod
    def _generate_tasks(self):
        # return self._task_factory.build_find_to_eat_task(self._body, self._map, self._home_town)
        pass