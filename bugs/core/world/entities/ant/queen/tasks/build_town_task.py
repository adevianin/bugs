from core.world.entities.task.task import Task
from ..queen_ant_body import QueenAntBody
from core.world.entities.town.town import Town

class BuildTownTask(Task):

    def __init__(self, body: QueenAntBody, new_town: Town):
        super().__init__(body)
        self._new_town = new_town

    def do_step(self):
        is_built = self._body.build_town(self._new_town)

        if (is_built):
            self.mark_as_done()
