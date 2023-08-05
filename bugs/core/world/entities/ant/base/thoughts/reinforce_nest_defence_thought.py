from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.nest.nest import Nest
from typing import List
from core.world.utils.point import Point

class ReinforceNestDefenceThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, fight_near_enemies_thought: FightNearEnemiesThought, searching_walk_thought: SearchingWalkThought, defending_nest: Nest, point_to_check: Point = None, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.REINFORCE_NEST_DEFENCE, flags=flags, sayback=sayback)
        self._nested_thoughts['searching_walk_thought'] = searching_walk_thought
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._point_to_check = point_to_check
        self._defending_nest = defending_nest

        self._defending_nest.events.add_listener('died', self._on_defending_nest_died)
        self._body.events.add_listener('colony_signal:enemy_spotted', self._on_enemy_spotted_signal)
        self._body.events.add_listener('colony_signal:no_enemies', self._on_no_enemies_signal)

    @property
    def searching_walk_thought(self) -> SearchingWalkThought:
        return self._nested_thoughts['searching_walk_thought']
    
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
        
        self.searching_walk_thought.do_step()

    def _on_enemy_spotted_signal(self, signal: dict):
        nest: Nest = signal['nest']
        positions: List[Point] = signal['enemies_positions']
        if nest.id == self._defending_nest.id:
            self._point_to_check = self._body.calc_nearest_point(positions)

    def _on_no_enemies_signal(self, signal: dict):
        nest: Nest = signal['nest']
        if nest.id == self._defending_nest.id:
            self.done()

    def _on_defending_nest_died(self):
        self.cancel()

    def _on_stop_thinking(self):
        super()._on_stop_thinking()

        self._body.events.remove_listener('colony_signal:enemy_spotted', self._on_enemy_spotted_signal)
        self._body.events.remove_listener('colony_signal:no_enemies', self._on_no_enemies_signal)
        self._defending_nest.events.remove_listener('died', self._on_defending_nest_died)

        