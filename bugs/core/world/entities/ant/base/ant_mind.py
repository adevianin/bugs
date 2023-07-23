from core.world.entities.base.live_entity.mind import Mind
from core.world.entities.thought.thought_factory import ThoughtFactory
from .ant_body import AntBody
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
import math

class AntMind(Mind):

    def __init__(self, events: EventEmitter, body: AntBody, thought_factory: ThoughtFactory, world_interactor: WorldInteractor, memory: Memory, is_auto_thought_generation: bool, home_nest: Nest):
        super().__init__(events, body, thought_factory, world_interactor, memory, is_auto_thought_generation)
        self.home_nest = home_nest

    def feed_myself(self, sayback: str = None, asap: bool = False):
        thought = self._thought_factory.build_feed_myself_full(home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought, asap)

    def collect_food(self, sayback: str = None):
        thought = self._thought_factory.build_collect_food_full(home_nest=self.home_nest, sayback=sayback)
        self._register_thought(thought)

    def prepare_for_operation(self, sayback: str = None):
        super().prepare_for_operation()
        thought = self._thought_factory.build_prepare_for_operation_full(home_nest=self.home_nest, assemble_point=self._calc_assemble_point(), sayback=sayback)
        self._register_thought(thought, True)
    
    def relocate_to_nest(self, nest: Nest):
        self.home_nest = nest

    def found_nest(self, building_site: Point, from_colony_id: int, sayback: str):
        thought = self._thought_factory.build_found_nest_thought(building_site=building_site, from_colony_id=from_colony_id, sayback=sayback)
        self._register_thought(thought)

    def build_nest(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_build_nest_thought(building_nest=nest, sayback=sayback)
        self._register_thought(thought)

    def attack_nest(self, nest: Nest, sayback: str):
        thought = self._thought_factory.build_attack_nest_thought(nest=nest, sayback=sayback)
        self._register_thought(thought)
    
    def _calc_assemble_point(self):
        return Point(self.home_nest.position.x, self.home_nest.position.y + 40)
    
    def _generate_thoughts(self):
        super()._generate_thoughts()
        if not self._has_thoughts_to_do() and self._am_i_far_away_from_home():
            go_home_thought = self._thought_factory.build_go_in_nest_thought(nest=self.home_nest)
            self._register_thought(go_home_thought)

    def _am_i_far_away_from_home(self):
        dist_from_home = math.dist([self.home_nest.position.x, self.home_nest.position.y], [self._body.position.x, self._body.position.y])
        return dist_from_home > self.home_nest.area
