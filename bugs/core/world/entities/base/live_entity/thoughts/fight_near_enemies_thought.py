from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.base.live_entity.live_body import LiveBody

class FightNearEnemiesThought(Thought):

    _body: LiveBody

    def __init__(self, fight_enemy_thought: FightEnemyThought, flags, sayback: str):
        super().__init__(type=ThoughtTypes.FIGHT_NEAR_ENEMIES, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_enemy_thought'] = fight_enemy_thought

    @property
    def fight_enemy_thought(self) -> FightEnemyThought:
        return self._nested_thoughts['fight_enemy_thought']
    
    @property
    def is_fighting(self) -> bool:
        return self.fight_enemy_thought.has_enemy_to_fight

    def do_step(self):
        if not self.fight_enemy_thought.has_enemy_to_fight:
            self._search_enemies_to_fight()

        if self.fight_enemy_thought.has_enemy_to_fight:
            self.fight_enemy_thought.do_step()
            if not self.fight_enemy_thought.has_enemy_to_fight:
                self._search_enemies_to_fight()

    def _search_enemies_to_fight(self):
        enemies = self._body.look_around_for_enemies()
        if (len(enemies) > 0):
            self.fight_enemy_thought.set_enemy(enemies[0])
