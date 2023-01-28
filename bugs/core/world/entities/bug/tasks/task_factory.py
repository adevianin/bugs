from core.world.entities.base.live_entity import TaskFactory
from ..body import BugBody

class BugTaskFactory(TaskFactory):

    def __init__(self, body: BugBody) -> None:
        super().__init__(body)