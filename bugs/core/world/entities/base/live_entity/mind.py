from abc import ABC, abstractmethod
from .body import Body
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.thought.thought import Thought
from core.world.utils.event_emiter import EventEmitter
from typing import List
from core.world.utils.point import Point
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.thought.thought_types import ThoughtTypes

class Mind(ABC):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        self._body = body
        self._thought_factory = thought_factory
        self._thoughts_stack: List[Thought] = []
        self._is_auto_thought_generation = is_auto_thought_generation
        self.events = events

    @property
    def thoughts(self):
        return self._thoughts_stack
    
    @property
    def is_auto_thought_generation(self):
        return self._is_auto_thought_generation
    
    def walk_to(self, position: Point, sayback: str = None):
        thought = self._thought_factory.build_walk_to_thought(body=self._body, position=position, sayback=sayback)
        self._register_thought(thought)

    def fight_enemy(self, enemy: iEnemy, asap: bool = True, sayback: str = None):
        thought = self._thought_factory.build_fight_enemy_thought(body=self._body, enemy=enemy, sayback=sayback)
        self._register_thought(thought, asap)

    def random_walk(self):
        thought = self._thought_factory.build_random_walk_thought(self._body, center=None, radius=None)
        self._register_thought(thought)

    def do_step(self):
        self._body.memory.treat_records()

        if self._is_auto_thought_generation:
            self._generate_thoughts()

        if self._has_thoughts_to_do():
            self._get_current_thought().do_step()

        self._handle_done_thoughts()

    def set_thoughts(self, thoughts: list[Thought]):
        for thought in thoughts:
            self._register_thought(thought)

    def toggle_auto_thought_generation(self, is_auto: bool):
        self._is_auto_thought_generation = is_auto

    def free_mind(self):
        if self._has_thoughts_to_do():
            for thought in self._thoughts_stack:
                thought.cancel()
        self._thoughts_stack.clear()

    @abstractmethod
    def _generate_thoughts(self):
        pass

    def _register_thought(self, thought: Thought, asap: bool = False):
        if asap and self._has_thoughts_to_do():
            current_thought = self._get_current_thought()
            if (current_thought.can_be_delayed()):
                current_thought.delay()
            else:
                current_thought.cancel()
            self._thoughts_stack.insert(0, thought)
        else:
            self._thoughts_stack.append(thought)

    def _get_current_thought(self) -> Thought:
        for thought in self._thoughts_stack:
            if not thought.is_canceled and not thought.is_done:
                return thought
        return None

    def _has_thoughts_to_do(self) -> bool:
        return self._get_current_thought() is not None

    def _handle_done_thoughts(self):
        done_thoughts: List[Thought] = [] 
        for thought in self._thoughts_stack:
            if (thought.is_done or thought.is_canceled):
                done_thoughts.append(thought)
        
        for done_thought in done_thoughts:
            if done_thought.is_done and done_thought.sayback:
                self._body.say(done_thought.sayback, done_thought.results)
            self._thoughts_stack.remove(done_thought)

    def _am_i_think_thought_type(self, thought_type: ThoughtTypes):
        if self._has_thoughts_to_do():
            current_thought = self._get_current_thought()
            return current_thought.type == thought_type
        else:
            return False

