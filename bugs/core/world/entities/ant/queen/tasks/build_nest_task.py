from core.world.entities.task.task import Task
from ..queen_ant_body import QueenAntBody
from core.world.entities.nest.nest import Nest

class BuildNestTask(Task):

    def __init__(self, body: QueenAntBody, new_nest: Nest):
        super().__init__(body)
        self._new_nest = new_nest

    def do_step(self):
        is_built = self._body.build_nest(self._new_nest)

        if (is_built):
            self.mark_as_done()
