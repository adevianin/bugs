from .task import Task
from typing import Callable

class TaskGroup():

    class CallbackCollector():

        def __init__(self):
            self._callbacks = []

        def on_done(self, callback):
            self._callbacks.append(callback)
            return self
        
        def has_callbacks(self):
            return len(self._callbacks) > 0
        
        def pull_callback(self):
            clb = self._callbacks[0]
            self._callbacks.remove(clb)
            return clb
        
    @classmethod
    def build_tasks_group(cls, tasks: list[Task]):
        return TaskGroup(tasks)

    def __init__(self, tasks: list[Task]):
        self._tasks = tasks
        self._on_done_callback = None
        self._callback_collector = None

        for task in self._tasks:
            task.on_done(self._on_task_done)

    def on_done(self, callback: Callable):
        self._on_done_callback = callback
        if not self._callback_collector:
            self._callback_collector = TaskGroup.CallbackCollector()
        return self._callback_collector

    def _on_task_done(self, task_result):
        if self._are_all_tasks_done():
            result = self._on_done_callback()
            if isinstance(result, TaskGroup) and self._callback_collector.has_callbacks():
                task_group = result
                task_group._callback_collector = self._callback_collector
                task_group.on_done(self._callback_collector.pull_callback())

    def _are_all_tasks_done(self):
        for task in self._tasks:
            if not task.is_done():
                return False
            
        return True
    