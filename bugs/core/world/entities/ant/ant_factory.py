from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.tasks.ant_task_factory import AntTaskFactory
from .worker.worker_ant import WorkerAnt
from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .base.ant_types import AntTypes
from core.world.map import Map
from core.world.entities.town.town import Town
from core.world.entities.base.live_entity.memory import Memory
from .base.larva import Larva
from .warrior.warrior_ant_body import WarriorAntBody
from .warrior.warrior_ant_mind import WarrirorAntMind
from .warrior.warrior_ant import WarriorAnt

class AntFactory():

    def __init__(self, event_bus: EventEmitter, map: Map) -> None:
        self._event_bus = event_bus
        self._map = map

    def build_ant(self, id: int, ant_type: AntTypes, position: Point, town: Town) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, position, town)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, position, town)
            case _:
                raise Exception('uknown type of ant')
            
    def give_birth(self, larva: Larva, town: Town):
        return self.build_ant(-1, larva.ant_type, larva.position, town)
    
    def _build_warrior_ant(self, id: int, position: Point, town: Town):
        ant_events = EventEmitter()
        body = WarriorAntBody(ant_events, position)
        ant_task_factory = AntTaskFactory(body, self._map)
        mind = WarrirorAntMind(body, ant_task_factory, self._map, Memory(), town)
        ant = WarriorAnt(self._event_bus, id, mind, body)

        return ant
    
    def _build_worker_ant(self, id: int, position: Point, town: Town):
        ant_events = EventEmitter()
        body = WorkerAntBody(ant_events, position)
        ant_task_factory = AntTaskFactory(body, self._map)
        mind = WorkerAntMind(body, ant_task_factory, self._map, Memory(), town)
        ant = WorkerAnt(self._event_bus, id, mind, body)

        return ant

