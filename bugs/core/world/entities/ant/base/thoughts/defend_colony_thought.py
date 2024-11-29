from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.utils.point import Point

class DefendColonyThought(Thought):

    _body: AntBody

    def __init__(self, fight_near_enemies_thought: FightNearEnemiesThought, point_to_check: Point = None, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.DEFEND_COLONY, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._point_to_check = point_to_check

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    @property
    def point_to_check(self):
        return self._point_to_check
    
    def _on_start_thinking(self):
        super()._on_start_thinking()
        self._body.events.add_listener('colony_signal:enemy_spotted_in_colony_area', self._on_enemy_spotted)
        self._body.events.add_listener('colony_signal:no_enemies_in_colony_area', self._on_no_enemies)

    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._body.events.remove_listener('colony_signal:enemy_spotted_in_colony_area', self._on_enemy_spotted)
        self._body.events.remove_listener('colony_signal:no_enemies_in_colony_area', self._on_no_enemies)
    
    def do_step(self):
        self.fight_near_enemies_thought.do_step()
        if self.fight_near_enemies_thought.is_fighting:
            return
        
        if self._point_to_check:
            is_walk_done = self._body.step_to(self._point_to_check)
            if is_walk_done:
                self._point_to_check = None
            return
        
        self.done()

    def _on_enemy_spotted(self, signal):
        self._point_to_check = self._body.calc_nearest_point(signal['enemies_positions'])

    def _on_no_enemies(self, signal):
        self.done()

