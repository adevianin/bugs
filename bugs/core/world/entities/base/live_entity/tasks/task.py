from abc import ABC, abstractclassmethod
from ..body import Body

class Task(ABC):

    def __init__(self, body: Body):
        self._body = body
        self._is_done = False

    def is_done(self):
        return self._is_done

    def mark_as_done(self):
        self._is_done = True

    @abstractclassmethod
    def do_step(self):
        pass