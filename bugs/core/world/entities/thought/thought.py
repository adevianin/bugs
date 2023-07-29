from abc import ABC, abstractclassmethod
from ..base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from .thought_types import ThoughtTypes

class Thought(ABC):

    def __init__(self, type: ThoughtTypes, flags: dict, sayback: str):
        self.body = None
        self.memory = None
        self._type = type
        self._is_done = False
        self._is_canceled = False
        self._results = None
        self._sayback = sayback
        self._flags = flags or {}

    @property
    def is_done(self):
        return self._is_done
    
    @property
    def is_canceled(self):
        return self._is_canceled
    
    @property
    def results(self):
        return self._results
    
    @property
    def sayback(self):
        return self._sayback
    
    @property
    def type(self):
        return self._type
    
    @property
    def flags(self):
        return self._flags
    
    def set_mind_parts(self, body: Body, memory: Memory):
        self._body = body
        self._memory = memory

    def mark_as_done(self, results = None):
        self._is_done = True
        self._results = results

    def can_be_delayed(self) -> bool:
        return True
    
    def delay(self):
        pass

    def cancel(self):
        self._is_canceled = True
        pass

    def restart(self):
        self._is_done = False
        self._is_canceled = False
        self._results = None

    @abstractclassmethod
    def do_step(self) -> bool:
        pass

    def _read_flag(self, flag_name: str):
        if flag_name in self._flags:
            return self._flags[flag_name]
        else: 
            return False
        
    def _write_flag(self, flag_name: str, value: bool):
        self._flags[flag_name] = value
