from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.food.food import Food

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

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_ant(self, id: int, from_colony: int, ant_type: AntTypes, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory: Memory, picked_food: Food, is_auto_thought_generation: bool, is_in_operation: bool) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case AntTypes.QUEEN:
                return self._build_queen_ant(id, from_colony, dna_profile, position, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case _:
                raise Exception('uknown type of ant')
            
    def _build_warrior_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        body = WarriorAntBody(events, dna_profile, position, located_in_nest, picked_food)
        mind = WarrirorAntMind(events, body, self._thought_factory, world_interactor, memory, is_auto_thought_generation, nest)
        ant = WarriorAnt(self._event_bus, events, id, from_colony, mind, body, is_in_operation)

        return ant
    
    def _build_worker_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        body = WorkerAntBody(events, dna_profile, position, located_in_nest, picked_food)
        mind = WorkerAntMind(events, body, self._thought_factory, world_interactor, memory, is_auto_thought_generation, nest)
        ant = WorkerAnt(self._event_bus, events, id, from_colony, mind, body, is_in_operation)

        return ant
    
    def _build_queen_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        body = QueenAntBody(events, dna_profile, position, located_in_nest, picked_food)
        mind = QueenAntMind(events, body, self._thought_factory, world_interactor, memory, is_auto_thought_generation, nest)
        ant = QueenAnt(self._event_bus, events, id, from_colony, mind, body, is_in_operation)

        return ant
    