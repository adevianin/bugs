from .thought import Thought
from typing import Callable

class ThoughtGroup():

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
    def build_thoughts_group(cls, thoughts: list[Thought]):
        return ThoughtGroup(thoughts)

    def __init__(self, thoughts: list[Thought]):
        self._thoughts = thoughts
        self._on_done_callback = None
        self._callback_collector = None

        for thought in self._thoughts:
            thought.on_done(self._on_thought_done)

    def on_done(self, callback: Callable):
        self._on_done_callback = callback
        if not self._callback_collector:
            self._callback_collector = ThoughtGroup.CallbackCollector()
        return self._callback_collector

    def _on_thought_done(self, thought_result):
        if self._are_all_thoughts_done():
            result = self._on_done_callback()
            if isinstance(result, ThoughtGroup) and self._callback_collector.has_callbacks():
                thought_group = result
                thought_group._callback_collector = self._callback_collector
                thought_group.on_done(self._callback_collector.pull_callback())

    def _are_all_thoughts_done(self):
        for thought in self._thoughts:
            if not thought.is_done():
                return False
            
        return True
    