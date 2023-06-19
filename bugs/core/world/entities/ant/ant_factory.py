from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.ant_types import AntTypes
from core.world.entities.map import Map
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from .base.larva import Larva
from core.world.id_generator import IdGenerator

from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .worker.worker_ant import WorkerAnt
from .worker.worker_task_factory import WorkerTaskFactory

from .warrior.warrior_ant_body import WarriorAntBody
from .warrior.warrior_ant_mind import WarrirorAntMind
from .warrior.warrior_ant import WarriorAnt
from .warrior.warrior_task_factory import WarriorTaskFactory

from .queen.queen_ant_body import QueenAntBody
from .queen.queen_ant_mind import QueenAntMind
from .queen.queen_ant import QueenAnt
from .queen.queen_task_factory import QueenTaskFactory

class AntFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map) -> None:
        self._event_bus = event_bus
        self._id_generator = id_generator
        self._map = map

    def build_ant(self, id: int, from_colony: int, ant_type: AntTypes, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, from_colony, dna_profile, position, nest, located_in_nest)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, from_colony, dna_profile, position, nest, located_in_nest)
            case AntTypes.QUEEN:
                return self._build_queen_ant(id, from_colony, dna_profile, position, nest, located_in_nest)
            case _:
                raise Exception('uknown type of ant')
            
    def give_birth(self, larva: Larva, nest: Nest):
        return self.build_ant(self._id_generator.generate_id(), nest.from_colony, larva.ant_type, larva.dna_profile, larva.position, nest, None)
    
    def _build_warrior_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest):
        ant_body_events = EventEmitter()
        ant_mind_events = EventEmitter()
        body = WarriorAntBody(ant_body_events, dna_profile, position, located_in_nest)
        ant_task_factory = WarriorTaskFactory(body, self._map)
        mind = WarrirorAntMind(ant_mind_events, body, ant_task_factory, self._map, Memory(), nest)
        ant = WarriorAnt(self._event_bus, id, from_colony, mind, body)

        return ant
    
    def _build_worker_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest):
        ant_body_events = EventEmitter()
        ant_mind_events = EventEmitter()
        body = WorkerAntBody(ant_body_events, dna_profile, position, located_in_nest)
        ant_task_factory = WorkerTaskFactory(body, self._map)
        mind = WorkerAntMind(ant_mind_events, body, ant_task_factory, self._map, Memory(), nest)
        ant = WorkerAnt(self._event_bus, id, from_colony, mind, body)

        return ant
    
    def _build_queen_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest):
        ant_body_events = EventEmitter()
        ant_mind_events = EventEmitter()
        body = QueenAntBody(ant_body_events, dna_profile, position, located_in_nest)
        ant_task_factory = QueenTaskFactory(body, self._map)
        mind = QueenAntMind(ant_mind_events, body, ant_task_factory, self._map, Memory(), nest)
        ant = QueenAnt(self._event_bus, id, from_colony, mind, body)

        return ant

