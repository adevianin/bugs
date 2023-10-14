from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought

class AttackNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, nest: Nest, fight_near_enemies_thought: FightNearEnemiesThought, flags: dict, sayback: str):
        super().__init__(body=body, type=ThoughtTypes.ATTACK_NEST, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._nest = nest

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']

    @property
    def nest_id(self):
        return self._nest.id
    
    def do_step(self):
        is_fighting = self.fight_near_enemies_thought.do_step()
        if is_fighting:
            return True
        
        is_near_nest = self._body.is_near_to_attack(self._nest.position)
        if is_near_nest:
            self._body.damage_nest(self._nest.body)
            if self._nest.is_died:
                self.done()
        else:
            self._body.step_to(self._nest.position)

        return True


