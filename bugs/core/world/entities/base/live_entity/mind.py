from abc import ABC, abstractclassmethod
from .body import Body
from .live_entity_thought_factory import LiveEntityThoughtFactory
from core.world.entities.thought.thought import Thought
from core.world.entities.map import Map
from core.world.entities.base.entity_types import EntityTypes
from .memory import Memory
from core.world.utils.event_emiter import EventEmitter
from asyncio import Future

class Mind(ABC):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: LiveEntityThoughtFactory, map: Map, memory: Memory):
        self._body = body
        self._thought_factory = thought_factory
        self._map = map
        self._memory = memory
        self._thoughts_stack = []
        self._is_auto_thought_generation = True
        self.events = events

        self._body.events.add_listener('walk', self._on_walk)

    def do_step(self):
        if self._is_auto_thought_generation:
            self._generate_thoughts()

        if self._has_thoughts_to_do():
            self._get_current_thought().do_step()

        self._clear_done_thoughts()

    def toggle_auto_thought_generation(self, is_auto: bool):
        self._is_auto_thought_generation = is_auto

    def force_free(self):
        if self._has_thoughts_to_do():
            current_thought = self._get_current_thought()
            if (current_thought.can_be_delayed()):
                current_thought.delay()
                self._thoughts_stack = []
            else:
                self._thoughts_stack = [current_thought]

    def _generate_thoughts(self):
        if (self._body.check_am_i_hungry()):
            self._register_thought(self._generate_feed_myself_thought(), True)

    def _register_thought(self, thought: Thought, asap: bool = False):
        if asap and self._has_thoughts_to_do():
            if (self._get_current_thought().can_be_delayed()):
                self._get_current_thought().delay()
                self._thoughts_stack.insert(0, thought)
            else:
                self._thoughts_stack.insert(1, thought)
        else:
            self._thoughts_stack.append(thought)

    def _get_current_thought(self):
        return self._thoughts_stack[0]

    def _has_thoughts_to_do(self):
        return len(self._thoughts_stack) > 0

    def _on_walk(self, **kwargs):
        near_entities = self._map.find_entities_near(self._body.position, self._body.sight_distance, [EntityTypes.FOOD, EntityTypes.FOOD_AREA])
        self._memory.remember_entities_at(self._body.position, self._body.sight_distance, near_entities)

    def _clear_done_thoughts(self):
        done_thoughts = []
        for thought in self._thoughts_stack:
            if (thought.is_done()):
                done_thoughts.append(thought)
        
        for done_thought in done_thoughts:
            self._thoughts_stack.remove(done_thought)

    @abstractclassmethod
    def _generate_feed_myself_thought(self):
        pass

