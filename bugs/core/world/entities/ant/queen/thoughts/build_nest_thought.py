from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest

class BuildNestThought(Thought):

    def __init__(self, new_nest: Nest, sayback: str):
        super().__init__(type='build_new_nest', flags={}, sayback=sayback)
        self._new_nest = new_nest

    def do_step(self):
        is_built = self._body.build_nest(self._new_nest)

        if (is_built):
            self.mark_as_done()
