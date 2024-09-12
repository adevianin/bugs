from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.nest.nest import Nest
from typing import List
from core.world.utils.point import Point
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought

class DefendNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, fight_near_enemies_thought: FightNearEnemiesThought, defending_nest: Nest, point_to_check: Point = None, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.DEFEND_NEST, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._point_to_check = point_to_check
        self._defending_nest = defending_nest

        self._defending_nest.events.add_listener('died', self._on_defending_nest_died)
        self._defending_nest.events.add_listener('is_under_attack', self._on_defending_nest_id_under_attack)
        self._defending_nest.events.add_listener('attack_is_over', self._on_defending_nest_attack_is_over)

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    @property
    def point_to_check(self):
        return self._point_to_check
    
    @property
    def defending_nest_id(self):
        return self._defending_nest.id
    
    def do_step(self):
        is_fighting = self.fight_near_enemies_thought.do_step()
        if is_fighting:
            return
        
        if self._point_to_check:
            is_walk_done = self._body.step_to(self._point_to_check)
            if is_walk_done:
                self._point_to_check = None
            return
        
        self.done()

    def _on_defending_nest_id_under_attack(self, enemies_positions: List[Point]):
        self._point_to_check = self._body.calc_nearest_point(enemies_positions)

    def _on_defending_nest_attack_is_over(self):
        self.done()

    def _on_defending_nest_died(self):
        self.cancel()

    def _on_stop_thinking(self):
        super()._on_stop_thinking()

        self._defending_nest.events.remove_listener('died', self._on_defending_nest_died)
        self._defending_nest.events.remove_listener('is_under_attack', self._on_defending_nest_id_under_attack)
        self._defending_nest.events.remove_listener('attack_is_over', self._on_defending_nest_attack_is_over)

        