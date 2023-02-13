from abc import ABC, abstractclassmethod
from .body import Body
from .tasks.task_factory import TaskFactory
from core.world.map import Map
from core.world.settings import MIN_TIME_POINTS_ACTION_COST

class Mind(ABC):

    def __init__(self, body: Body, task_factory: TaskFactory, map: Map):
        self._body = body
        self._task_factory = task_factory
        self._map = map
        self._current_task = None

    def do_step(self):
        counter = 0
        while self._body.time_points >= MIN_TIME_POINTS_ACTION_COST: #to avoid very short and ugly steps
            self._do_next_task()
            
            counter += 1
            if (counter > 10): 
                raise Exception('mind blow exception')

    def _do_next_task(self):
        if not self._current_task:
            self._current_task = self._generate_tasks()

        self._current_task.do_step()

        if self._current_task.is_done():
            self._current_task = None

    @abstractclassmethod
    def _generate_tasks(self):
        pass