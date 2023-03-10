from core.world.entities.base.live_entity.mind import Mind
from .tasks.task_factory import BugTaskFactory
from .bug_body import BugBody
from core.world.map import Map
from core.world.entities.town import Town
from core.world.entities.base.live_entity.memory import Memory

class BugMind(Mind):

    def __init__(self, body: BugBody, task_factory: BugTaskFactory, map: Map, memory: Memory, home_town: Town):
        super().__init__(body, task_factory, map, memory)
        self._home_town = home_town
