from abc import ABC, abstractclassmethod
from ..base.live_entity.body import Body
from core.world.entities.map import Map

class Thought(ABC):

    def __init__(self, body: Body, map: Map, type: str = '', flags: dict = {}, sayback: str = None):
        self._type = type
        self._body = body
        self._map = map
        self._is_done = False
        self._results = None
        self._sayback = sayback
        self._flags = flags

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
    
    @property
    def sayback(self):
        return self._sayback

    @abstractclassmethod
    def do_step(self):
        pass

    def to_full_json(self):
        return {
            'type': self._type,
            'sayback': self._sayback,
            'flags': self._flags
        }
