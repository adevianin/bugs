from abc import ABC, abstractclassmethod
from .body import Body
from .live_entity_task_factory import LiveEntityTaskFactory
from core.world.entities.task.task import Task
from core.world.map import Map
from core.world.entities.base.entity_types import EntityTypes
from .memory import Memory
from core.world.utils.event_emiter import EventEmitter
from asyncio import Future

class Mind(ABC):

    def __init__(self, events: EventEmitter, body: Body, task_factory: LiveEntityTaskFactory, map: Map, memory: Memory):
        self._body = body
        self._task_factory = task_factory
        self._map = map
        self._memory = memory
        self._tasks_stack = []
        self._is_auto_task_generation = True
        self.events = events

        self._body.events.add_listener('walk', self._on_walk)

    def do_step(self):
        if self._is_auto_task_generation:
            self._generate_tasks()

        if self._has_tasks_to_do():
            self._get_current_task().do_step()

        self._clear_done_tasks()

    def toggle_auto_task_generation(self, is_auto: bool):
        self._is_auto_task_generation = is_auto

    def force_free(self):
        if self._has_tasks_to_do():
            current_task = self._get_current_task()
            if (current_task.can_be_delayed()):
                current_task.delay()
                self._tasks_stack = []
            else:
                self._tasks_stack = [current_task]

    def _generate_tasks(self):
        if (self._body.check_am_i_hungry()):
            self._register_task(self._generate_feed_myself_task(), True)

    def _register_task(self, task: Task, asap: bool = False):
        if asap and self._has_tasks_to_do():
            if (self._get_current_task().can_be_delayed()):
                self._get_current_task().delay()
                self._tasks_stack.insert(0, task)
            else:
                self._tasks_stack.insert(1, task)
        else:
            self._tasks_stack.append(task)

    def _get_current_task(self):
        return self._tasks_stack[0]

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

    @abstractclassmethod
    def _generate_feed_myself_task(self):
        pass

