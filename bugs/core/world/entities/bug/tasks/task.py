from core.world.entities.base.live_entity.tasks.task import Task
from ..body import BugBody

class BugTask(Task):

    def __init__(self, body: BugBody):
      super().__init__(body)

    def do_step(self):
        pass