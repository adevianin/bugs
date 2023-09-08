from ..warrior_ant_body import WarriorAntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought

class KeepClearTerritoryThought(Thought):

    _body: WarriorAntBody

    def __init__(self, body: WarriorAntBody, fight_near_enemies_thought: FightNearEnemiesThought, random_walk_thought: RandomWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.KEEP_CLEAR_TERRITORY, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    def do_step(self):
        self._write_flag('is_fighting', self.fight_near_enemies_thought.do_step())
        if self._read_flag('is_fighting'):
            return
        
        self.random_walk_thought.do_step()
