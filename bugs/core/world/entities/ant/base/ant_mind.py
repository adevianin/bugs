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

    def __init__(self, events: EventEmitter, body: AntBody, thought_factory: ThoughtFactory, world_interactor: WorldInteractor, memory: Memory, home_nest: Nest):
        super().__init__(events, body, thought_factory, world_interactor, memory)
        self.home_nest = home_nest

    def prepare_for_operation(self, sayback: str):
        self.toggle_auto_thought_generation(False)
        self.force_free()
        thought = self._thought_factory.build_prepare_for_operation_full_thought(home=self.home_nest, assemble_point=self._calc_assemble_point(), sayback=sayback)
        self._register_thought(thought, True)

        return thought
    
    def leave_operation(self):
        # self.force_free()
        self.toggle_auto_thought_generation(True)
    
    def walk_to(self, position: Point, sayback: str):
        thought = self._thought_factory.build_walk_to_thought(position=position, sayback=sayback)
        self._register_thought(thought, True)

        return thought
    
    def relocate_to_nest(self, nest: Nest):
        self.home_nest = nest
    
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
