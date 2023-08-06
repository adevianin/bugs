from abc import ABC, abstractclassmethod
from .body import Body
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.thought.thought import Thought
from core.world.utils.event_emiter import EventEmitter
from typing import List
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.thought.thought_types import ThoughtTypes

class Mind(ABC):

    def __init__(self, events: EventEmitter, body: Body, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, is_in_operation: bool):
        self._body = body
        self._thought_factory = thought_factory
        self._thoughts_stack: List[Thought] = []
        self._is_auto_thought_generation = is_auto_thought_generation
        self.events = events
        self._is_in_opearetion = is_in_operation

    @property
    def thoughts(self):
        return self._thoughts_stack
    
    @property
    def is_auto_thought_generation(self):
        return self._is_auto_thought_generation
    
    @property
    def is_in_opearetion(self):
        return self._is_in_opearetion
    
    def go_in_nest(self, nest: Nest, sayback: str = None):
        thought = self._thought_factory.build_go_in_nest_thought(body=self._body, nest=nest, sayback=sayback)
        self._register_thought(thought)

    def walk_to(self, position: Point, sayback: str = None):
        thought = self._thought_factory.build_walk_to_thought(body=self._body, position=position, sayback=sayback)
        self._register_thought(thought)

    def prepare_for_operation(self, sayback: str = None):
        self.toggle_auto_thought_generation(False)
        self._free_mind()

    def fight_enemy(self, enemy: iEnemy, asap: bool = True, sayback: str = None):
        thought = self._thought_factory.build_fight_enemy_thought(body=self._body, enemy=enemy, sayback=sayback)
        self._register_thought(thought, asap)

    def join_operation(self):
        if (self._is_in_opearetion):
            raise Exception('already in operation')
        self._is_in_opearetion = True
    
    def leave_operation(self):
        self._is_in_opearetion = False
        self._body.sayer.remove_all_listeners()
        self._free_mind()
        self.toggle_auto_thought_generation(True)
    
    def do_step(self):
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

    def _free_mind(self):
        if self._has_thoughts_to_do():
            for thought in self._thoughts_stack:
                thought.cancel()

    def _generate_thoughts(self):
        # todo check is enemy near
        if (self._body.check_am_i_hungry()):
            self._generate_feed_myself_thought()

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
        return self._thoughts_stack[0]

    def _has_thoughts_to_do(self) -> bool:
        return len(self._thoughts_stack) > 0

    def _handle_done_thoughts(self):
        done_thoughts: List[Thought] = [] 
        for thought in self._thoughts_stack:
            if (thought.is_done or thought.is_canceled):
                done_thoughts.append(thought)
        
        for done_thought in done_thoughts:
            if done_thought.is_done and done_thought.sayback:
                self._body.say(done_thought.sayback, done_thought.results)
            self._thoughts_stack.remove(done_thought)

    @abstractclassmethod
    def _generate_feed_myself_thought(self):
        pass

    def _am_i_think_thought_type(self, thought_type: ThoughtTypes):
        if self._has_thoughts_to_do():
            current_thought = self._get_current_thought()
            return current_thought.type == thought_type
        else:
            return False

