from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.enemy_interface import iEnemy

class FightEnemyThought(Thought):

    MAX_ATTACK_DISTANCE = 80
    MIN_APPROACH_DISTANCE = 15


    _body: LiveBody

    def __init__(self, flags, sayback: str, enemy: iEnemy = None):
        super().__init__(type=ThoughtTypes.FIGHT_ENEMY, flags=flags, sayback=sayback)
        self._enemy = enemy

    @property
    def enemy_id(self):
        return self._enemy.id if self._enemy and not self._enemy.is_died else None
    
    @property
    def has_enemy_to_fight(self) -> bool:
        return bool(self._enemy) and not self._enemy.is_died and self._enemy.is_detectable
    
    def set_enemy(self, enemy: iEnemy):
        if self.is_completed:
            self.restart()
        self._enemy = enemy
        self._body.is_in_fight = True

    def do_step(self):
        if not self.has_enemy_to_fight:
            self.done()
            return
        
        self._body.is_in_fight = True
        
        dist_to_enemy = self._body.position.dist(self._enemy.position)
        if dist_to_enemy <= self.MAX_ATTACK_DISTANCE:

            if dist_to_enemy > self.MIN_APPROACH_DISTANCE:
                self._body.move_to_best_position(self._enemy.position)

            self._body.damage_another_body(self._enemy.body)

            if self._enemy.is_died:
                self.done()
        else:
            self._body.step_to_near(self._enemy.position)

    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._body.is_in_fight = False
