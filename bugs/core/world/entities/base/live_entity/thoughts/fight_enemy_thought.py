from core.world.entities.base.live_entity.body import Body
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.enemy_interface import iEnemy

class FightEnemyThought(Thought):

    _body: Body

    def __init__(self, body: Body, flags, sayback: str, enemy: iEnemy = None):
        super().__init__(body=body, type=ThoughtTypes.FIGHT_ENEMY, flags=flags, sayback=sayback)
        self._enemy = enemy

    @property
    def enemy_id(self):
        return self._enemy.id if self._enemy else None
    
    def set_enemy(self, enemy: iEnemy):
        self._enemy = enemy

    def do_step(self):
        if self._enemy.is_died:
            self.done()

        is_near_to_enemy = self._body.is_near_to_attack(self._enemy.position)

        if is_near_to_enemy:
            self._body.damage_enemy(self._enemy)
            if self._enemy.is_died:
                self.done()
        else:
            self._body.step_to_near(self._enemy.position)

        