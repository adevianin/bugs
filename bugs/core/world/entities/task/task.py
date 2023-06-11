from abc import ABC, abstractclassmethod
from ..base.live_entity.body import Body
from typing import Callable

class Task(ABC):

    def __init__(self, body: Body):
        self._body = body
        self._is_done = False
        self._results = None
        self._on_done_callbacks = []

    def is_done(self):
        return self._is_done

    def mark_as_done(self, results = None):
        self._is_done = True
        self._results = results
        self._do_on_done_callbacks()

    def can_be_delayed(self):
        return True
    
    def delay(self):
        pass

    def restart(self):
        self._is_done = False
        self._results = None

    def on_done(self, callback: Callable):
        self._on_done_callbacks.append(callback)

    @property
    def results(self):
        return self._results

    @abstractclassmethod
    def do_step(self):
        pass

    def _do_on_done_callbacks(self):
        for callback in self._on_done_callbacks:
            callback(self._results)