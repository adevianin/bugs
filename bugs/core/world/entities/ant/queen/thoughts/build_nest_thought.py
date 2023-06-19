from core.world.entities.thought.thought import Thought
from ..queen_ant_body import QueenAntBody
from core.world.entities.nest.nest import Nest

class BuildNestThought(Thought):

    def __init__(self, body: QueenAntBody, new_nest: Nest, sayback: str):
        super().__init__(body, sayback)
        self._new_nest = new_nest

    def do_step(self):
        is_built = self._body.build_nest(self._new_nest)

        if (is_built):
            self.mark_as_done()
