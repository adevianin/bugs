from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_factory import ThoughtFactory
from ..base.ant_mind import AntMind
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.utils.point import Point

class WarrirorAntMind(AntMind):

    def __init__(self, body: AntBody, thought_factory: ThoughtFactory, is_auto_thought_generation: bool, home_nest: Nest, is_in_operation: bool):
        super().__init__(body, thought_factory, is_auto_thought_generation, home_nest, is_in_operation)

        self._body.events.add_listener('colony_signal:warrirors_reinforcement_needed', self._on_warriors_reinforcement_needed)

    def patrol_home_territory(self, sayback: str = None):
        thought = self._thought_factory.build_patrol_nest_territory_full(self._body, self.home_nest, sayback=sayback)
        self._register_thought(thought)

    def keep_clear_territory(self, position: Point, area: int, sayback: str = None):
        thought = self._thought_factory.build_keep_clear_territory_full(body=self._body, position=position, area=area, sayback=sayback)
        self._register_thought(thought)

    def _auto_generate_thoughts(self):
        super()._auto_generate_thoughts()
        if not self._has_thoughts_to_do():
            self.patrol_home_territory()

    def _on_warriors_reinforcement_needed(self, signal: dict):
        if self._is_in_opearetion:
            return
        
        nest: Nest = signal['nest']
        enemies_positions: Point = signal['enemies_positions']
        is_my_nest = nest.id == self.home_nest.id
        if not is_my_nest:
            if self._has_thoughts_to_do():
                current_thought = self._get_current_thought()

                if current_thought.type == ThoughtTypes.DEFEND_TERRITORY:
                    if current_thought.can_be_delayed():
                        self.reinforce_nest(nest=nest, point_to_check=self._body.calc_nearest_point(enemies_positions), asap=True)
                elif current_thought.type == ThoughtTypes.REINFORCE_NEST_DEFENCE:
                    return
                else:
                    self.reinforce_nest(nest=nest, point_to_check=self._body.calc_nearest_point(enemies_positions), asap=True)
            else:
                self.reinforce_nest(nest=nest)