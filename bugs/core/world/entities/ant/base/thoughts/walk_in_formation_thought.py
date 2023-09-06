from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.entities.ant.base.ant_body import AntBody

class WalkInFormationThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, flags: dict, sayback: str):
        super().__init__(body, ThoughtTypes.WALK_IN_FORMATION, flags, sayback)

    def do_step(self) -> bool:
        super().do_step()

        self._body.step_in_formation()