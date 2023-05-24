from core.world.entities.base.live_entity.mind import Mind
from .tasks.ant_task_factory import AntTaskFactory
from .ant_body import AntBody
from core.world.map import Map
from core.world.entities.town.town import Town
from core.world.entities.base.live_entity.memory import Memory

class AntMind(Mind):

    def __init__(self, body: AntBody, task_factory: AntTaskFactory, map: Map, memory: Memory, home_town: Town):
        super().__init__(body, task_factory, map, memory)
        self._home_town = home_town
