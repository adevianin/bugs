from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody

class AttackNestThought(Thought):

    _body: AntBody

    def __init__(self, nest: Nest, flags: dict, sayback: str):
        super().__init__(type=ThoughtTypes.ATTACK_NEST, flags=flags, sayback=sayback)
        self._nest = nest

    @property
    def nest_id(self):
        return self._nest.id
    
    def do_step(self):
        enemies = self._body.look_around_for_enemies()

        if len(enemies) > 0:
            self._body.say('i_see_enemies', enemies)

        is_near_nest = self._body.is_near_to(self._nest.position)

        if is_near_nest:
            self._body.damage_nest(self._nest)
            if self._nest.is_died:
                self.mark_as_done()
        else:
            self._body.step_to(self._nest.position)

        return True


