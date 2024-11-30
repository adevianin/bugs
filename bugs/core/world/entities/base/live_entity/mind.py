from abc import ABC, abstractmethod
from .live_body import LiveBody
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.thought.thought import Thought
from typing import List
from core.world.utils.point import Point
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.thought.thought_types import ThoughtTypes

class Mind(ABC):

    _body: LiveBody

    def __init__(self, body: LiveBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool):
        self._body = body
        self._thought_factory = thought_factory
        self._thoughts_stack: List[Thought] = []
        self._is_auto_thought_generation = is_auto_thought_generation

    @property
    def thoughts(self):
        return self._thoughts_stack
    
    @property
    def is_auto_thought_generation(self):
        return self._is_auto_thought_generation
    
    def walk_to(self, position: Point, sayback: str = None):
        thought = self._thought_factory.build_walk_to_thought(position=position, sayback=sayback)
        self._register_thought(thought)

    def fight_enemy(self, enemy: iEnemy, asap: bool, sayback: str = None):
        thought = self._thought_factory.build_fight_enemy_thought(enemy=enemy, sayback=sayback)
        self._register_thought(thought, asap)

    def random_walk(self):
        thought = self._thought_factory.build_random_walk_thought(center=None, radius=None)
        self._register_thought(thought)

    def wait_step(self, step_count: int, sayback: str):
        thought = self._thought_factory.build_wait_step(step_count=step_count, sayback=sayback)
        self._register_thought(thought)

    def do_step(self):
        self._body.memory.treat_records()

        if self._is_auto_thought_generation:
            self._auto_generate_thoughts()

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
                if not thought.is_completed:
                    thought.cancel()
        # self._thoughts_stack.clear() do not clear thought stack here

    @abstractmethod
    def _auto_generate_thoughts(self):
        pass

    def _register_thought(self, thought: Thought, asap: bool = False, immediately = False):
        if asap and immediately:
            raise Exception('thought can be asap and immediately at the same time')
        
        if (not asap and not immediately) or not self._has_thoughts_to_do():
            self._thoughts_stack.append(thought)
        else:
            current_thought = self._get_current_thought()
            if (current_thought.can_be_delayed()):
                current_thought.delay()
                self._thoughts_stack.insert(0, thought)
            elif immediately:
                current_thought.cancel()
                self._thoughts_stack.insert(0, thought)
            elif asap:
                self._thoughts_stack.insert(1, thought)
        
        thought.setup(self._body)
                
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
        
    def _is_thought_in_stack(self, thought_type: ThoughtTypes):
        for thought in self._thoughts_stack:
            if thought.type == thought_type:
                return True
        
        return False

