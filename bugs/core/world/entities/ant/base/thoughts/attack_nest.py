from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought

class AttackNestThought(Thought):

    _body: AntBody

    def __init__(self, nest: Nest, fight_enemy_thought: FightEnemyThought, flags: dict, sayback: str):
        super().__init__(type=ThoughtTypes.ATTACK_NEST, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_enemy_thought'] = fight_enemy_thought
        self._nest = nest

    @property
    def fight_enemy_thought(self) -> FightEnemyThought:
        return self._nested_thoughts['fight_enemy_thought']

    @property
    def nest_id(self):
        return self._nest.id
    
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
            return 

        is_near_nest = self._body.is_near_to(self._nest.position)

        if is_near_nest:
            self._body.damage_nest(self._nest)
            if self._nest.is_died:
                self.done()
        else:
            self._body.step_to(self._nest.position)

        return True


