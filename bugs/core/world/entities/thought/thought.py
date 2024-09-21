from abc import ABC, abstractmethod
from ..base.live_entity.live_body import LiveBody
from .thought_types import ThoughtTypes
from typing import Callable

class Thought(ABC):

    def __init__(self, body: LiveBody, type: ThoughtTypes, flags: dict, sayback: str):
        self._body = body
        self._type = type
        self._results = None
        self._sayback = sayback
        self._flags = flags or self._default_flags
        self._nested_thoughts = {}

    @property
    def is_done(self):
        return self._read_flag('is_done')
    
    @property
    def is_canceled(self):
        return self._read_flag('is_canceled')
    
    @property
    def is_completed(self):
        return self.is_canceled or self.is_done
    
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
        if self.is_completed:
            raise Exception('thought is already compleated')
        self._write_flag('is_done', True)
        self._results = results
        self._on_stop_thinking()

    def cancel(self):
        if self.is_completed:
            raise Exception('thought is already compleated')
        self._write_flag('is_canceled', True)
        self._results = None
        self._on_stop_thinking()

    def can_be_delayed(self) -> bool:
        return True
    
    def delay(self):
        pass

    def restart(self):
        self._flags = self._default_flags
        self._results = None
        self._iterate_nested_thoughts(lambda thought: thought.restart())

    def do_step(self) -> bool:
        pass

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

    @property
    def _default_flags(self):
        return {
            'is_done': False,
            'is_canceled': False
        }


