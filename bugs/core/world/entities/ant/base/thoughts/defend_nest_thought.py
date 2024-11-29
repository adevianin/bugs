from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.nest.nest import Nest

class DefendNestThought(Thought):

    _body: AntBody

    def __init__(self, fight_near_enemies_thought: FightNearEnemiesThought, defending_nest: Nest, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.DEFEND_NEST, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._defending_nest = defending_nest
        self._point_to_check = None

        self._nest_removal_block_id = self._defending_nest.block_removal()

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    @property
    def defending_nest_id(self):
        return self._defending_nest.id
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._defending_nest.unblock_removal(self._nest_removal_block_id)
    
    def do_step(self):
        self.fight_near_enemies_thought.do_step()
        if self.fight_near_enemies_thought.is_fighting:
            return
        
        if not self._defending_nest.is_under_attack:
            self.done()
            return
        
        if self._defending_nest.is_died:
            self.cancel()
            return
        
        if not self._point_to_check:
            self._point_to_check = self._body.calc_nearest_point(self._defending_nest.nearby_enemy_positions)
        
        if self._point_to_check:
            is_walk_done = self._body.step_to(self._point_to_check)
            if is_walk_done:
                self._point_to_check = None
            return
        
        self.done()
