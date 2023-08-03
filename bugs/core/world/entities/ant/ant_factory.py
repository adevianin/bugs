from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.food.food import Food
from core.world.entities.ant.base.larva import Larva

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

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_new_ant(self, id: int, larva: Larva, nest: Nest):
        return self.build_ant(id, nest.from_colony, larva.ant_type, larva.dna_profile, nest.position, None, nest, None, None, None, True, False)

    def build_ant(self, id: int, from_colony: int, ant_type: AntTypes, dna_profile: str, position: Point, hp: int, nest: Nest, located_in_nest: Nest, memory: Memory, picked_food: Food, is_auto_thought_generation: bool, is_in_operation: bool) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, from_colony, dna_profile, position, hp, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, from_colony, dna_profile, position, hp, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case AntTypes.QUEEN:
                return self._build_queen_ant(id, from_colony, dna_profile, position, hp, nest, located_in_nest, memory, is_auto_thought_generation, picked_food, is_in_operation)
            case _:
                raise Exception('uknown type of ant')
            
    def _build_warrior_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, hp: int, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        hp = hp if hp else WarriorAnt.MAX_HP
        body = WarriorAntBody(events, sayer, dna_profile, position, hp, located_in_nest, picked_food, world_interactor)
        mind = WarrirorAntMind(events, body, self._thought_factory, memory, is_auto_thought_generation, nest, is_in_operation)
        ant = WarriorAnt(events, id, from_colony, mind, body)

        return ant
    
    def _build_worker_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, hp: int, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        hp = hp if hp else WorkerAnt.MAX_HP
        body = WorkerAntBody(events, sayer, dna_profile, position, hp, located_in_nest, picked_food, world_interactor)
        mind = WorkerAntMind(events, body, self._thought_factory, memory, is_auto_thought_generation, nest, is_in_operation)
        ant = WorkerAnt(events, id, from_colony, mind, body)

        return ant
    
    def _build_queen_ant(self, id: int, from_colony: int, dna_profile: str, position: Point, hp: int, nest: Nest, located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_food: Food, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = memory if memory else Memory()
        hp = hp if hp else QueenAnt.MAX_HP
        body = QueenAntBody(events, sayer, dna_profile, position, hp, located_in_nest, picked_food, world_interactor)
        mind = QueenAntMind(events, body, self._thought_factory, memory, is_auto_thought_generation, nest, is_in_operation)
        ant = QueenAnt(events, id, from_colony, mind, body)

        return ant
    