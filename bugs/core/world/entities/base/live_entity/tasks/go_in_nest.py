from core.world.entities.task.task import Task
from ..body import Body
from core.world.entities.nest.nest import Nest

class GoInNestTask(Task):

    def __init__(self, body: Body, nest: Nest):
        super().__init__(body)
        self._nest = nest

        self._reset_flags()

    def do_step(self):
        if self._is_near_nest:
            self._body.get_in_nest(self._nest)
            self.mark_as_done()
        else:
            self._is_near_nest = self._body.step_to(self._nest.position)

    def restart(self):
        self._reset_flags()
        return super().restart()
    
    def _reset_flags(self):
        self._is_near_nest = False