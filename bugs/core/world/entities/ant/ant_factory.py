from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.ant_types import AntTypes
from core.world.entities.map import Map
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from .base.larva import Larva
from core.world.id_generator import IdGenerator
from core.world.entities.thought.thought_factory import ThoughtFactory

from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .worker.worker_ant import WorkerAnt

from .warrior.warrior_ant_body import WarriorAntBody
from .warrior.warrior_ant_mind import WarrirorAntMind
from .warrior.warrior_ant import WarriorAnt

from .queen.queen_ant_body import QueenAntBody
from .queen.queen_ant_mind import QueenAntMind
from .queen.queen_ant import QueenAnt

class AntFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, thought_factory: ThoughtFactory) -> None:
        self._event_bus = event_bus
        self._id_generator = id_generator
        self._map = map
        self._thought_factory = thought_factory

    def build_ant_from_json(self, ant_json: dict):
        position = Point(ant_json['position'][0], ant_json['position'][1])
        nest = self._map.get_entity_by_id(ant_json['from_nest'])
        located_in_nest = None
        if ant_json['located_in_nest_id'] != None:
            located_in_nest = self._map.get_entity_by_id(ant_json['located_in_nest_id'])
        ant_type = AntTypes(ant_json['ant_type'])
        return self.build_ant(ant_json['id'], ant_json['from_colony'], ant_type, ant_json['dna_profile'], position, nest, located_in_nest, ant_json['memory'])

    def build_ant(self, id: int, from_colony: int, ant_type: AntTypes, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory_data) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory_data)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory_data)
            case AntTypes.QUEEN:
                return self._build_queen_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory_data)
            case _:
                raise Exception('uknown type of ant')
            
    def give_birth(self, larva: Larva, nest: Nest):
        return self.build_ant(self._id_generator.generate_id(), nest.from_colony, larva.ant_type, larva.dna_profile, larva.position, nest, None)
    
    def _build_warrior_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory_data):
        events = EventEmitter()
        body = WarriorAntBody(events, dna_profile, position, located_in_nest)
        mind = WarrirorAntMind(events, body, self._thought_factory, self._map, Memory.build_from_json(memory_data), nest)
        ant = WarriorAnt(self._event_bus, events, id, from_colony, mind, body)

        return ant
    
    def _build_worker_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory_data):
        events = EventEmitter()
        body = WorkerAntBody(events, dna_profile, position, located_in_nest)
        mind = WorkerAntMind(events, body, self._thought_factory, self._map, Memory.build_from_json(memory_data), nest)
        ant = WorkerAnt(self._event_bus, events, id, from_colony, mind, body)

        return ant
    
    def _build_queen_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory_data):
        events = EventEmitter()
        body = QueenAntBody(events, dna_profile, position, located_in_nest)
        mind = QueenAntMind(events, body, self._thought_factory, self._map, Memory.build_from_json(memory_data), nest)
        ant = QueenAnt(self._event_bus, events, id, from_colony, mind, body)

        return ant
    