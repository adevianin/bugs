from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.queen.queen_ant_body import QueenAntBody

class RemoveWingsThought(Thought):

    _body: QueenAntBody

    def __init__(self, flags: dict, sayback: str):
        super().__init__(type=ThoughtTypes.REMOVE_WINGS, flags=flags, sayback=sayback)
    
    def do_step(self):
        self._body.remove_wings()
        self.done(True)