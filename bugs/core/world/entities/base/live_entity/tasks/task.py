from abc import ABC, abstractclassmethod
from ..body import Body

class Task(ABC):

    def __init__(self, body: Body):
        self._body = body
        self._is_done = False
        self._results = None

    def is_done(self):
        return self._is_done

    def mark_as_done(self, results = None):
        self._is_done = True
        self._results = results

    def can_be_delayed(self):
        return True
    
    def delay(self):
        pass

    def restart(self):
        self._is_done = False
        self._results = None

    @property
    def results(self):
        return self._results

    @abstractclassmethod
    def do_step(self):
        pass