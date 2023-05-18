from abc import ABC, abstractclassmethod
from .body import Body
from .tasks.task_factory import TaskFactory
from .tasks.task import Task
from core.world.map import Map
from core.world.entities.base.entity_types import EntityTypes
from .memory import Memory

class Mind(ABC):

    def __init__(self, body: Body, task_factory: TaskFactory, map: Map, memory: Memory):
        self._body = body
        self._task_factory = task_factory
        self._map = map
        self._memory = memory
        self._tasks_stack = []

        self._body.events.add_listener('walk', self._on_walk)

    def do_step(self):
        self._do_step_activity()
        self._clear_done_tasks()
            
    def _register_task(self, task: Task, as_first_priority: bool = False):
        if (as_first_priority):
            self._get_current_task().delay()
            self._tasks_stack.insert(0, task)
        else:
            self._tasks_stack.append(task)

    def _get_current_task(self):
        return self._tasks_stack[0]
            
    @abstractclassmethod
    def _do_step_activity(self):
        pass

    def _has_tasks_to_do(self):
        return len(self._tasks_stack) > 0

    def _on_walk(self, **kwargs):
        near_entities = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD, EntityTypes.FOOD_AREA])
        self._memory.remember_entities_at(self._body.position, self._body.sight_distance, near_entities)

    def _clear_done_tasks(self):
        done_tasks = []
        for task in self._tasks_stack:
            if (task.is_done()):
                done_tasks.append(task)
        
        for done_task in done_tasks:
            self._tasks_stack.remove(done_task)
