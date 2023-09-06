from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.base.live_entity.live_body import LiveBody

class FightNearEnemiesThought(Thought):

    _body: LiveBody

    def __init__(self, body: LiveBody, fight_enemy_thought: FightEnemyThought, flags, sayback: str):
        super().__init__(body=body, type=ThoughtTypes.FIGHT_NEAR_ENEMIES, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_enemy_thought'] = fight_enemy_thought

    @property
    def fight_enemy_thought(self) -> FightEnemyThought:
        return self._nested_thoughts['fight_enemy_thought']

    def do_step(self):
        if (not self._read_flag('is_fighting_enemy')):
            enemies = self._body.look_around_for_enemies()
            is_enemy_near = len(enemies) > 0
            if (is_enemy_near):
                self._write_flag('is_fighting_enemy', True)
                self.fight_enemy_thought.restart()
                self.fight_enemy_thought.set_enemy(enemy=enemies[0])
        
        if (self._read_flag('is_fighting_enemy')):
            self.fight_enemy_thought.do_step()
            self._write_flag('is_fighting_enemy', not self.fight_enemy_thought.is_done)
            return True
        
        return False
        