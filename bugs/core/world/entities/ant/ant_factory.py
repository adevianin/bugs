from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
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
from core.world.entities.ant.base.genes import Genes
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.ant.base.genome.genome import Genome
from core.world.entities.ant.base.genome.chromosomes_set import ChromosomesSet

class AntFactory():

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_new_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, ant_type: AntTypes, position: Point, home_nest: Nest = None):
        match(ant_type):
            case AntTypes.WORKER:
                return self.build_new_worker_ant(id, from_colony_id, owner_id, stats, position, home_nest)
            case AntTypes.WARRIOR:    
                return self.build_new_warrior_ant(id, from_colony_id, owner_id, stats, position, home_nest)
            case AntTypes.QUEEN:    
                return self.build_new_queen_ant(id, from_colony_id, owner_id, stats, position, home_nest)

    def build_new_worker_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, home_nest: Nest):
        return self.build_worker_ant(id=id, from_colony_id=from_colony_id, owner_id=owner_id, stats=stats, position=position, angle=0, hp=None, nest=home_nest, located_in_nest=None, 
                                     memory_data=None, is_auto_thought_generation=True, picked_item=None, is_in_operation=False)
    
    def build_new_warrior_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, home_nest: Nest):
        return self.build_warrior_ant(id=id, from_colony_id=from_colony_id, owner_id=owner_id, stats=stats, position=position, angle=0, hp=None, nest=home_nest, located_in_nest=None, 
                                      memory_data=None, is_auto_thought_generation=True, picked_item=None, is_in_operation=False)
    
    def build_new_queen_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, home_nest: Nest):
        genes_worker_stats = StatsLibrary.GENES_WORKER_DEFAULT
        genes_worker_food_required = 100 
        genes_warrior_stats = StatsLibrary.GENES_WARRIOR_DEFAULT
        genes_warrior_food_required = 500
        genes_queen_stats = StatsLibrary.GENES_QUEEN_DEFAULT
        genes_queen_food_required = 1000
        genes = Genes.build(genes_worker_stats, genes_worker_food_required, genes_warrior_stats, genes_warrior_food_required, genes_queen_stats, genes_queen_food_required)
        return self.build_queen_ant(id=id, from_colony_id=from_colony_id, owner_id=owner_id, stats=stats, position=position, angle=0, hp=None, nest=home_nest, located_in_nest=None, 
                                    memory_data=None, is_auto_thought_generation=True, picked_item=None, is_in_operation=False, genes=genes, is_fertilized=False, 
                                    is_in_nuptial_flight=False, genome={})

    def build_warrior_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                          is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome):
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        body = WarriorAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor, genome)
        mind = WarrirorAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = WarriorAnt(self._event_bus, EventEmitter(), id, from_colony_id, owner_id, body, mind)

        return ant
    
    def build_worker_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                         is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome):
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        body = WorkerAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor, genome)
        mind = WorkerAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = WorkerAnt(self._event_bus, EventEmitter(), id, from_colony_id, owner_id, body, mind)

        return ant
    
    def build_queen_ant(self, id: int, from_colony_id: int, owner_id: int, stats: LiveStats, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                        is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, male_chromosomes_set: ChromosomesSet, is_in_nuptial_flight: bool):
        sayer = EventEmitter()
        world_interactor = WorldInteractor()
        memory = Memory(memory_data)
        body = QueenAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor, genome, male_chromosomes_set, is_in_nuptial_flight)
        mind = QueenAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation)
        ant = QueenAnt(self._event_bus, EventEmitter(), id, from_colony_id, owner_id, body, mind)

        return ant
    