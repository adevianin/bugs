from abc import ABC, abstractclassmethod
from .body import Body
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.thought.thought import Thought
from .memory import Memory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from typing import List
from core.world.entities.base.entity import Entity
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point

class Mind(ABC):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: ThoughtFactory, world_interactor: WorldInteractor, memory: Memory, is_auto_thought_generation: bool):
        self._body = body
        self._thought_factory = thought_factory
        self._world_interactor = world_interactor
        self._memory = memory
        self._thoughts_stack = []
        self._is_auto_thought_generation = is_auto_thought_generation
        self.events = events

    @property
    def thoughts(self):
        return self._thoughts_stack
    
    @property
    def memory(self):
        return self._memory
    
    @property
    def is_auto_thought_generation(self):
        return self._is_auto_thought_generation
    
    def go_in_nest(self, nest: Nest, sayback: str = None):
        thought = self._thought_factory.build_go_in_nest_thought(nest=nest, sayback=sayback)
        self._register_thought(thought)

    def walk_to(self, position: Point, sayback: str = None):
        thought = self._thought_factory.build_walk_to_thought(position=position, sayback=sayback)
        self._register_thought(thought)
    
    def do_step(self):
        if self._is_auto_thought_generation:
            self._generate_thoughts()

        if self._has_thoughts_to_do():
            self._get_current_thought().do_step()

        self._handle_done_thoughts()

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

    def set_thoughts(self, thoughts: list[Thought]):
        for thought in thoughts:
            self._register_thought(thought)

    def set_entities_in_sight(self, entities: List[Entity]):
        self._world_interactor.set_nearby_entities(entities)

    def _generate_thoughts(self):
        if (self._body.check_am_i_hungry()):
            self._generate_feed_myself_thought()

    def _register_thought(self, thought: Thought, asap: bool = False):
        thought.set_mind_parts(self._body, self._memory, self._world_interactor)
        
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

    def _handle_done_thoughts(self):
        done_thoughts = []
        for thought in self._thoughts_stack:
            if (thought.is_done()):
                done_thoughts.append(thought)
        
        for done_thought in done_thoughts:
            if done_thought.sayback:
                self._say(done_thought.sayback)
            self._thoughts_stack.remove(done_thought)

    def _say(self, phrase: str):
        self.events.emit(f'say:{phrase}')

    @abstractclassmethod
    def _generate_feed_myself_thought(self):
        pass

