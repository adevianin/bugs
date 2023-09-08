from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes

class WaitStepThought(Thought):

    def __init__(self, body: LiveBody, step_count: int, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.WAIT_STEP, flags=flags, sayback=sayback)
        self._step_count = step_count

    @property
    def step_count(self):
        return self._step_count

    def do_step(self):
        if self._step_count == 0:
            self.done()
        else:
            self._step_count -= 1
    