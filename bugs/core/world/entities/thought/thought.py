from abc import ABC
from ..base.live_entity.live_body import LiveBody
from .thought_types import ThoughtTypes
from typing import Callable

class Thought(ABC):

    class Flags():
        IS_DONE = 'is_done'
        IS_CANCELED = 'is_canceled'

    def __init__(self, type: ThoughtTypes, flags: dict, sayback: str):
        self._type = type
        self._results = None
        self._sayback = sayback
        self._flags = flags or {}
        self._nested_thoughts = {}

    @property
    def is_done(self):
        return self._read_flag(self.Flags.IS_DONE)
    
    @property
    def is_canceled(self):
        return self._read_flag(self.Flags.IS_CANCELED)
    
    @property
    def is_completed(self):
        return self.is_canceled or self.is_done
    
    @property
    def is_in_progress(self):
        return not self.is_canceled and not self.is_done
    
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
    
    def setup(self, body: LiveBody):
        self._set_body(body)
        self._iterate_nested_thoughts(lambda thought: thought.setup(body))
        self._on_start_thinking()
    
    def done(self, results = None):
        if self.is_completed:
            return
        self._iterate_nested_thoughts(lambda thought: thought.done())
        self._write_flag(self.Flags.IS_DONE, True)
        self._results = results
        self._on_stop_thinking()

    def cancel(self):
        if self.is_completed:
            return
        self._iterate_nested_thoughts(lambda thought: thought.cancel())
        self._write_flag(self.Flags.IS_CANCELED, True)
        self._results = None
        self._on_stop_thinking()

    def can_be_delayed(self) -> bool:
        return True
    
    def delay(self):
        pass

    def restart(self):
        self._flags = {}
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

    def _set_body(self, body: LiveBody):
        self._body = body

    def _on_stop_thinking(self):
        pass

    def _on_start_thinking(self):
        pass
