from abc import ABC, abstractmethod
from ..base.live_entity.live_body import LiveBody
from .thought_types import ThoughtTypes
from typing import Callable

class Thought(ABC):

    def __init__(self, body: LiveBody, type: ThoughtTypes, flags: dict, sayback: str):
        self._body = body
        self._type = type
        self._is_done = False
        self._is_canceled = False
        self._results = None
        self._sayback = sayback
        self._flags = flags or {}
        self._nested_thoughts = {}

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
    
    def done(self, results = None):
        self._is_done = True
        self._results = results
        self._on_stop_thinking()

    def cancel(self):
        self._is_canceled = True
        self._results = None
        self._on_stop_thinking()

    def can_be_delayed(self) -> bool:
        return True
    
    def delay(self):
        pass

    def restart(self):
        self._is_done = False
        self._is_canceled = False
        self._flags = {}
        self._results = None
        self._iterate_nested_thoughts(lambda thought: thought.restart())

    def do_step(self) -> bool:
        if self._is_done or self._is_canceled:
            raise Exception('cant think thought')

    def _read_flag(self, flag_name: str):
        if flag_name in self._flags:
            return self._flags[flag_name]
        else: 
            return False
        
    def _write_flag(self, flag_name: str, value: bool):
        self._flags[flag_name] = value

    def _iterate_nested_thoughts(self, callback: Callable[['Thought'], None]):
        for thought_name in self._nested_thoughts.keys():
            callback(self._nested_thoughts[thought_name])

    def _on_stop_thinking(self):
        pass


