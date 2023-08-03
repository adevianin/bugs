from ..warrior_ant_body import WarriorAntBody
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.nest.nest import Nest
from typing import List
from core.world.utils.point import Point

class DefendTerritoryThought(Thought):

    _body: WarriorAntBody

    def __init__(self, fight_near_enemies_thought: FightNearEnemiesThought, search_walk_thought: SearchingWalkThought, defending_nest: Nest, point_to_check: Point = None, reinforcing_nest: Nest = None, point_to_reinforce: Point = None, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.DEFEND_TERRITORY, flags=flags, sayback=sayback)
        self._nested_thoughts['searching_walk_thought'] = search_walk_thought
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._point_to_check = point_to_check
        self._defending_nest = defending_nest
        self._reinforcing_nest = reinforcing_nest
        self._point_to_reinforce = point_to_reinforce

        self._defending_nest.events.once('died', self._on_defending_nest_died)

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
    def point_to_reinforce(self):
        return self._point_to_reinforce
    
    @property
    def defending_nest_id(self):
        return self._defending_nest.id
    
    @property
    def reinforcing_nest_id(self):
        return self._reinforcing_nest.id if self._reinforcing_nest else None

    def do_step(self):
        is_fighting = self.fight_near_enemies_thought.do_step()
        if is_fighting:
            return
        
        if self._read_flag('has_point_to_check') and not self._read_flag('is_reinforcing'):
            is_walk_done = self._body.step_to(self._point_to_check)
            if is_walk_done:
                self._write_flag('has_point_to_check', False)
                self._point_to_check = None
            return
        
        if (self._read_flag('has_reinforce_request') and not self._read_flag('is_reinforcing')):
            self._write_flag('is_reinforcing', True)

        if (self._read_flag('is_reinforcing')):
            is_walk_done = self._body.step_to(self._point_to_reinforce)
            if is_walk_done:
                self._write_flag('has_reinforce_request', False)
                self._write_flag('is_reinforcing', False)
                self._point_to_reinforce = None
                self._reinforcing_nest = None
                self._write_flag('returning_to_defending_nest', True)
            return
        
        if self._read_flag('returning_to_defending_nest'):
            is_walk_done = self._body.step_to(self._defending_nest.position)
            self._write_flag('returning_to_defending_nest', not is_walk_done)
            return

        self.searching_walk_thought.do_step()

    def set_mind_parts(self, body: WarriorAntBody, memory: Memory):
        super().set_mind_parts(body, memory)

        self._body.on_colony_signal('enemy_spotted', self._on_enemy_spotted)
        self._body.on_colony_signal('reinforcement_needed', self._on_reinforcement_request)

    def _on_enemy_spotted(self, nest: Nest, positions: List[Point]):
        if nest.id == self._defending_nest.id:
            self._write_flag('has_point_to_check', True)
            self._point_to_check = self._body.calc_nearest_point(positions)

    def _on_reinforcement_request(self, nest: Nest, positions: List[Point]):
        if nest.id != self._defending_nest.id:
            self._write_flag('has_reinforce_request', True)
            if not self._read_flag('is_reinforcing') or self._reinforcing_nest.id == nest.id:
                self._point_to_reinforce = self._body.calc_nearest_point(positions)
                self._reinforcing_nest = nest

    def _on_defending_nest_died(self):
        self.cancel()
        