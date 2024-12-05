from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class DefendMyselfThought(Thought):

    _body: AntBody

    def __init__(self, fight_near_enemies_thought: FightNearEnemiesThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.DEFEND_MYSELF, flags=flags, sayback=sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    def do_step(self):
        self._body.set_current_activity(AntActivityTypes.DEFENDING_MYSELF)

        self.fight_near_enemies_thought.do_step()
        if not self.fight_near_enemies_thought.is_fighting:
            self.done()
        

