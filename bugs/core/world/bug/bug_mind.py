from ..point import Point
import random

class BugMind:

    def __init__(self, bug_body, map, task_factory):
        self._tasks = []
        self._body = bug_body
        self._map = map
        self._task_factory = task_factory

    def do_step(self):
        while self._body.get_step_energy() > 0:
            self._do_next_task()

    def _do_next_task(self):
        if len(self._tasks) == 0:
            self._generate_tasks()

        current_task = self._tasks[0]
        current_task.do_step()

        if current_task.is_done():
            self._tasks.remove(current_task)

    def _generate_tasks(self):
        task = self._task_factory.build_search_task(self._body, self._map, 2)

        self._tasks.append(task)

