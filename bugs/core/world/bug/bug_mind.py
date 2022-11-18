from ..point import Point
import random

class BugMind:

    def __init__(self, bug_body, map, task_factory):
        self._current_task = None
        self._body = bug_body
        self._map = map
        self._task_factory = task_factory

    def do_step(self):
        while self._body.get_step_energy() > 0:
            self._do_next_task()

    def _do_next_task(self):
        if not self._current_task:
            self._generate_tasks()

        self._current_task.do_step()

        if self._current_task.is_done():
            self._current_task = None

    def _generate_tasks(self):
        self._current_task = self._task_factory.build_find_to_eat_task(self._body, self._map)

