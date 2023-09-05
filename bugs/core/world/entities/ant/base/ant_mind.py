from core.world.entities.base.live_entity.mind import Mind
from core.world.entities.thought.thought_factory import ThoughtFactory
from .ant_body import AntBody
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
import math
from abc import abstractmethod

class AntMind(Mind):

    _body: AntBody

    def __init__(self, events: EventEmitter, body: AntBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, home_nest: Nest, is_in_operation: bool):
        super().__init__(events, body, thought_factory, is_auto_thought_generation)
        self.home_nest = home_nest
        self._is_in_opearetion = is_in_operation

    @property
    def is_in_opearetion(self):
        return self._is_in_opearetion
    
    def ask_participation(self):
        return True

    def feed_myself(self, sayback: str = None, asap: bool = False):
        thought = self._thought_factory.build_feed_myself_full(body=self._body, home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought, asap)

    def go_home(self, sayback: str = None, asap: bool = False):
        go_home_thought = self._thought_factory.build_go_in_nest_thought(body=self._body, nest=self.home_nest)
        self._register_thought(go_home_thought)

    def collect_food(self, sayback: str = None):
        thought = self._thought_factory.build_collect_food_full(body=self._body, home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought)

    def prepare_for_operation(self, sayback: str = None):
        self.toggle_auto_thought_generation(False)
        self.free_mind()
        thought = self._thought_factory.build_prepare_for_operation_full(body=self._body, home_nest=self.home_nest, assemble_point=self._calc_assemble_point(), sayback=sayback)
        self._register_thought(thought)
    
    def relocate_to_nest(self, nest: Nest):
        self.home_nest = nest

    def found_nest(self, building_site: Point, from_colony_id: int, sayback: str):
        thought = self._thought_factory.build_found_nest_thought(body=self._body, building_site=building_site, from_colony_id=from_colony_id, sayback=sayback)
        self._register_thought(thought)

    def build_nest(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_build_nest_thought(body=self._body, building_nest=nest, sayback=sayback)
        self._register_thought(thought)

    def attack_nest(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_attack_nest_thought_full(body=self._body, nest=nest, sayback=sayback)
        self._register_thought(thought)

    def reinforce_nest(self, nest: Nest, point_to_check: Point, asap: bool = True, sayback: str = None):
        thought = self._thought_factory.build_reinforce_nest_defence_thought_full(body=self._body, nest=nest, point_to_check=point_to_check, sayback=sayback)
        self._register_thought(thought=thought, asap=asap)

    def toggle_is_in_operation(self, is_in_operation: bool):
        self._is_in_opearetion = is_in_operation

    def _calc_assemble_point(self):
        return Point(self.home_nest.position.x, self.home_nest.position.y + 40)
    
    def _generate_thoughts(self):
        super()._generate_thoughts()

        if (self._body.check_am_i_hungry()):
            self.feed_myself(asap=True)

        if not self._has_thoughts_to_do() and self._am_i_far_away_from_home():
            self.go_home()

    def _am_i_far_away_from_home(self):
        dist_from_home = math.dist([self.home_nest.position.x, self.home_nest.position.y], [self._body.position.x, self._body.position.y])
        return dist_from_home > self.home_nest.area
