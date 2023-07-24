from abc import ABC, abstractclassmethod
from ..base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from .thought_types import ThoughtTypes

class Thought(ABC):

    def __init__(self, type: ThoughtTypes, flags: dict, sayback: str):
        self.body = None
        self.memory = None
        self.world_interactor = None
        self._type = type
        self._is_done = False
        self._results = None
        self._sayback = sayback

        self._reset_flags()
        if flags:
            self._flags.update(flags)

    def set_mind_parts(self, body: Body, memory: Memory, world_interactor: WorldInteractor):
        self._body = body
        self._memory = memory
        self._world_interator = world_interactor

    def is_done(self):
        return self._is_done

    def mark_as_done(self, results = None):
        self._is_done = True
        self._results = results

    def can_be_delayed(self):
        return True
    
    def delay(self):
        pass

    def cancel(self):
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
    
    @property
    def type(self):
        return self._type
    
    @property
    def flags(self):
        return self._flags

    @abstractclassmethod
    def do_step(self) -> bool:
        pass

    def _reset_flags(self):
        self._flags = {}
