from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant import Ant
from .base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.live_entity.live_stats import LiveStats

from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .worker.worker_ant import WorkerAnt

from .warrior.warrior_ant_body import WarriorAntBody
from .warrior.warrior_ant_mind import WarrirorAntMind
from .warrior.warrior_ant import WarriorAnt

from .queen.queen_ant_body import QueenAntBody
from .queen.queen_ant_mind import QueenAntMind
from .queen.queen_ant import QueenAnt
from .queen.genes import Genes

class AntFactory():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_new_ant(self, id: int, from_colony_id: int, stats: LiveStats, ant_type: AntTypes, position: Point, home_nest: Nest = None):
        return self.build_ant(id, from_colony_id, stats, ant_type, position, 0, None, home_nest, None, None, None, True, False)

    def build_ant(self, id: int, from_colony_id: int, stats: LiveStats, ant_type: AntTypes, position: Point, angle: int, hp: int, home_nest: Nest, located_in_nest: Nest, memory_data: dict, picked_item: Item, is_auto_thought_generation: bool, is_in_operation: bool) -> Ant:
        match ant_type:
            case AntTypes.WORKER:
                return self._build_worker_ant(id, from_colony_id, stats, position, angle, hp, home_nest, located_in_nest, memory_data, is_auto_thought_generation, picked_item, is_in_operation)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(id, from_colony_id, stats, position, angle, hp, home_nest, located_in_nest, memory_data, is_auto_thought_generation, picked_item, is_in_operation)
            case AntTypes.QUEEN:
                return self._build_queen_ant(id, from_colony_id, stats, position, angle, hp, home_nest, located_in_nest, memory_data, is_auto_thought_generation, picked_item, is_in_operation)
            case _:
                raise Exception('uknown type of ant')
            
    def _build_warrior_ant(self, id: int, from_colony_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        hp = hp if hp else WarriorAntBody.MAX_HP
        body = WarriorAntBody(events, stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor)
        mind = WarrirorAntMind(events, body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = WarriorAnt(events, id, from_colony_id, body, mind)

        return ant
    
    def _build_worker_ant(self, id: int, from_colony_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        hp = hp if hp else WorkerAntBody.MAX_HP
        body = WorkerAntBody(events, stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor)
        mind = WorkerAntMind(events, body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = WorkerAnt(events, id, from_colony_id, body, mind)

        return ant
    
    def _build_queen_ant(self, id: int, from_colony_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool):
        events = EventEmitter()
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        hp = hp if hp else QueenAntBody.MAX_HP
        worker_stats = LiveStats.build(100, 10, 32, 200, 1000, 2, 10, 1)
        worker_food_required = 100
        warrior_stats = LiveStats.build(500, 20, 32, 200, 1000, 2, 20, 5)
        warrior_food_required = 500
        queen_stats = LiveStats.build(300, 20, 32, 200, 1000, 2, 20, 5)
        queen_food_required = 500
        genes = Genes.build(worker_stats, worker_food_required, warrior_stats, warrior_food_required, queen_stats, queen_food_required)
        body = QueenAntBody(events, stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor, genes)
        mind = QueenAntMind(events, body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = QueenAnt(events, id, from_colony_id, body, mind)

        return ant
    