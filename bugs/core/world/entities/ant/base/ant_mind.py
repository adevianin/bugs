from core.world.entities.base.live_entity.mind import Mind
from core.world.entities.thought.thought_factory import ThoughtFactory
from .ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes
from .guardian_behaviors import GuardianBehaviors
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord

import math
from typing import List

class AntMind(Mind):

    _body: AntBody

    def __init__(self, body: AntBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, home_nest: Nest, is_in_operation: bool, guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation)
        self.home_nest = home_nest
        self._is_in_opearetion = is_in_operation
        self.guardian_behavior = guardian_behavior
        self.is_cooperative = is_cooperative

        self._body.events.add_listener('died', self._on_body_died)
        self._body.events.add_listener('colony_signal:enemy_spotted_in_colony_area', self._on_enemy_spotted_in_colony_area)
        self._body.events.add_listener('received_combat_damage', self._on_received_combat_damage)

        self._listen_home_nest()

    @property
    def is_in_opearetion(self):
        return self._is_in_opearetion
    
    def feed_myself(self, sayback: str = None, asap: bool = False):
        thought = self._thought_factory.build_feed_myself_full(home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought, asap)

    def go_home(self, sayback: str = None, asap: bool = False):
        go_home_thought = self._thought_factory.build_go_in_nest_thought(nest=self.home_nest)
        self._register_thought(go_home_thought)

    def collect_food(self, sayback: str = None):
        thought = self._thought_factory.build_collect_food_full(home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought)

    def prepare_for_operation(self, assemble_point: Point = None, sayback: str = None):
        assemble_point = assemble_point or self._calc_assemble_point()
        thought = self._thought_factory.build_prepare_for_operation_full(home_nest=self.home_nest, assemble_point=assemble_point, sayback=sayback)
        self._register_thought(thought)
    
    def relocate_to_nest(self, nest: Nest):
        self._stop_listen_home_nest()
        self.home_nest = nest
        self._listen_home_nest()

    def build_nest(self, nest: Nest, get_inside_once_done: bool, sayback: str):
        thought = self._thought_factory.build_build_nest_thought(building_nest=nest, get_inside_once_done=get_inside_once_done, sayback=sayback)
        self._register_thought(thought)

    def attack_nest(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_attack_nest_thought_full(nest=nest, sayback=sayback)
        self._register_thought(thought)

    def build_fortification(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_build_fortification_full(nest=nest, sayback=sayback)
        self._register_thought(thought)

    def defend_nest(self, nest: Nest, point_to_check: Point, sayback: str = None):
        thought = self._thought_factory.build_defend_nest_thought_full(nest=nest, point_to_check=point_to_check, sayback=sayback)
        self._register_thought(thought=thought, immediately=True)

    def defend_colony(self, point_to_check: Point, sayback: str = None):
        thought = self._thought_factory.build_defend_colony_full(point_to_check, sayback)
        self._register_thought(thought=thought, immediately=True)

    def defend_myself(self, sayback: str = None):
        thought = self._thought_factory.build_defend_myself_full(sayback=sayback)
        self._register_thought(thought=thought, immediately=True)

    def hibernate(self, asap: bool = False):
        thought = self._thought_factory.build_hibernation_full(self.home_nest)
        self._register_thought(thought=thought, asap=asap)

    def shelter_in_home_nest(self):
        thought = self._thought_factory.build_shelter_in_nest_full(self.home_nest)
        self._register_thought(thought=thought, immediately=True)

    # def get_stashed_item_back(self, sayback: str = None):
    #     thought = self._thought_factory.build_get_stashed_item_back(sayback=sayback)
    #     self._register_thought(thought=thought)

    def toggle_is_in_operation(self, is_in_operation: bool):
        self._is_in_opearetion = is_in_operation

    def _listen_home_nest(self):
        if self.home_nest:
            self.home_nest.events.add_listener('is_under_attack', self._on_home_nest_is_under_attack)

    def _stop_listen_home_nest(self):
        if self.home_nest:
            self.home_nest.events.remove_listener('is_under_attack', self._on_home_nest_is_under_attack)

    def _calc_assemble_point(self):
        return Point(self.home_nest.position.x, self.home_nest.position.y + 40)
    
    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()

        if (self._body.check_am_i_hungry() and not self._is_thought_in_stack(ThoughtTypes.FEED_MYSELF)):
            self.feed_myself(asap=True)

        if (self._body.check_urge_to_hibernate() and not self._is_thought_in_stack(ThoughtTypes.HIBERNATION)):
            self.hibernate(asap=True)

        if not self._has_thoughts_to_do() and self._am_i_far_away_from_home():
            self.go_home()

    def _am_i_far_away_from_home(self):
        dist_from_home = math.dist([self.home_nest.position.x, self.home_nest.position.y], [self._body.position.x, self._body.position.y])
        return dist_from_home > self.home_nest.area
    
    def _on_body_died(self, death_record: BaseDeathRecord):
        self._stop_listen_home_nest()
        self.free_mind()

    def _on_home_nest_is_under_attack(self, enemies_positions: List[Point]):
        if self._is_in_opearetion or self._is_thought_in_stack(ThoughtTypes.DEFEND_NEST) or self._is_thought_in_stack(ThoughtTypes.SHELTER_IN_NEST):
            return
        
        if self.guardian_behavior == GuardianBehaviors.NEST:
            nearest_enemy_pos = self._body.calc_nearest_point(enemies_positions)
            self.defend_nest(self.home_nest, nearest_enemy_pos)
        elif self.guardian_behavior == GuardianBehaviors.NONE:
            self.shelter_in_home_nest()

    def _on_enemy_spotted_in_colony_area(self, signal):
        if self._is_in_opearetion or self.guardian_behavior != GuardianBehaviors.COLONY or self._is_thought_in_stack(ThoughtTypes.DEFEND_COLONY):
            return

        nearest_enemy_pos = self._body.calc_nearest_point(signal['enemies_positions'])
        self.defend_colony(nearest_enemy_pos)

    def _on_received_combat_damage(self):
        if self._is_in_opearetion or self._body.is_in_fight:
            return

        self.defend_myself()
