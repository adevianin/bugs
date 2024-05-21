from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_factory import ThoughtFactory
from ..base.ant_mind import AntMind
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.utils.point import Point

class WorkerAntMind(AntMind):

    def __init__(self, body: AntBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, home_nest: Nest, is_in_operation: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation, home_nest, is_in_operation)

        self._body.events.add_listener('colony_signal:workers_reinforcement_needed', self._on_workers_reinforcement_needed)

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._has_thoughts_to_do():
            self.collect_food()

    def _on_workers_reinforcement_needed(self, signal: dict):
        if self._is_in_opearetion:
            return
        
        nest: Nest = signal['nest']
        enemies_positions: Point = signal['enemies_positions']
        is_my_nest = nest.id == self.home_nest.id
        if is_my_nest and not self._am_i_think_thought_type(ThoughtTypes.REINFORCE_NEST_DEFENCE):
            self.reinforce_nest(nest=nest, point_to_check=self._body.calc_nearest_point(enemies_positions), asap=True)
