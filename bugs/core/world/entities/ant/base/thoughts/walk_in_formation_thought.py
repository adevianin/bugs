from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought

class WalkInFormationThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, fight_near_enemies_thought: FightNearEnemiesThought, flags: dict, sayback: str):
        super().__init__(body, ThoughtTypes.WALK_IN_FORMATION, flags, sayback)
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought

        self._body.formation.events.add_listener('reached_destination', self._on_reached_destination)

    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    def do_step(self) -> bool:
        super().do_step()

        if self.fight_near_enemies_thought:
            self._write_flag('is_fighting', self.fight_near_enemies_thought.do_step())
            if self._read_flag('is_fighting'):
                return

        self._body.step_in_formation()

    def _on_reached_destination(self):
        self.done()