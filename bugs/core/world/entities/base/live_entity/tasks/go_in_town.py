from .task import Task
from ..body import Body
from core.world.entities.town.town import Town

class GoInTownTask(Task):

    def __init__(self, body: Body, town: Town):
        super().__init__(body)
        self._town = town

        self._reset_flags()

    def do_step(self):
        if self._is_near_town:
            self._body.get_in_town(self._town)
            self.mark_as_done()
        else:
            self._is_near_town = self._body.step_to(self._town.position)

    def restart(self):
        self._reset_flags()
        return super().restart()
    
    def _reset_flags(self):
        self._is_near_town = False