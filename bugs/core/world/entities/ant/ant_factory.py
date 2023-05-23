from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.tasks.ant_task_factory import AntTaskFactory
from .worker.worker_ant import WorkerAnt
from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .base.ant_types import AntTypes
from core.world.map import Map
from core.world.entities.town import Town
from core.world.entities.base.live_entity.memory import Memory

class AntFactory():

    def __init__(self, event_bus: EventEmitter) -> None:
        self._event_bus = event_bus

    def build_ant(self, map: Map, id: int, ant_type: AntTypes, position: Point, town: Town) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(map, id, position, town)
            case _:
                raise Exception('uknown type of ant')

    
    def _build_worker_ant(self, map: Map, id: int, position: Point, town: Town):
        ant_events = EventEmitter()
        body = WorkerAntBody(ant_events, position)
        ant_task_factory = AntTaskFactory(body, map)
        mind = WorkerAntMind(body, ant_task_factory, map, Memory(), town)
        bug = WorkerAnt(self._event_bus, id, mind, body)

        return bug

