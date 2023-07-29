from ..warrior_ant_body import WarriorAntBody
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought

class DefendTerritoryThought(Thought):

    _body: WarriorAntBody

    def __init__(self, fight_enemy_thought: FightEnemyThought, search_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.DEFEND_TERRITORY, flags=flags, sayback=sayback)
        self._searching_walk_thought = search_walk_thought
        self._fight_enemy_thought = fight_enemy_thought

    @property
    def searching_walk_thought(self):
        return self._searching_walk_thought
    
    @property
    def fight_enemy_thought(self):
        return self._fight_enemy_thought

    def do_step(self):
        if (not self._read_flag('is_fighting_enemy')):
            enemies = self._body.look_around_for_enemies()
            is_enemy_near = len(enemies) > 0
            if (is_enemy_near):
                self._write_flag('is_fighting_enemy', True)
                self._fight_enemy_thought.restart()
                self._fight_enemy_thought.set_enemy(enemy=enemies[0])
        
        if (self._read_flag('is_fighting_enemy')):
            self._fight_enemy_thought.do_step()
            self._write_flag('is_fighting_enemy', not self._fight_enemy_thought.is_done)
        else:
            self._searching_walk_thought.do_step()

    def set_mind_parts(self, body: WarriorAntBody, memory: Memory):
        super().set_mind_parts(body, memory)
        self._searching_walk_thought.set_mind_parts(body=body, memory=memory)
        self._fight_enemy_thought.set_mind_parts(body=body, memory=memory)
