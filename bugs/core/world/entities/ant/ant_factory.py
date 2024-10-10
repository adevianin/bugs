from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from .base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.item.items.base.item import Item
from .worker.worker_ant_body import WorkerAntBody
from .worker.worker_ant_mind import WorkerAntMind
from .worker.worker_ant import WorkerAnt
from .warrior.warrior_ant_body import WarriorAntBody
from .warrior.warrior_ant_mind import WarrirorAntMind
from .warrior.warrior_ant import WarriorAnt
from .queen.queen_ant_body import QueenAntBody
from .queen.queen_ant_mind import QueenAntMind
from .queen.queen_ant import QueenAnt
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.ant_stats import AntStats
from .male.male_ant_mind import MaleAntMind
from .male.male_ant_body import MaleAntBody
from .male.male_ant import MaleAnt
from .base.guardian_behaviors import GuardianBehaviors

class AntFactory():

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_new_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, genome: Genome, ant_type: AntTypes, position: Point, home_nest: Nest = None):
        match(ant_type):
            case AntTypes.WORKER:
                return self.build_new_worker_ant(id, name, from_colony_id, owner_id, genome, position, home_nest)
            case AntTypes.WARRIOR:    
                return self.build_new_warrior_ant(id, name, from_colony_id, owner_id, genome, position, home_nest)
            case AntTypes.QUEEN:    
                return self.build_new_queen_ant(id, name, from_colony_id, owner_id, genome, position, home_nest)
            case AntTypes.MALE:    
                return self.build_new_male_ant(id, name, from_colony_id, owner_id, genome, position, home_nest)

    def build_new_worker_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, genome: Genome, position: Point, home_nest: Nest):
        return self.build_worker_ant(id, name, from_colony_id, owner_id, position, 0, None, home_nest, None, None, True, None, False, genome, GuardianBehaviors.NEST, True)
    
    def build_new_warrior_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, genome: Genome, position: Point, home_nest: Nest):
        return self.build_warrior_ant(id, name, from_colony_id, owner_id, position, 0, None, home_nest, None, None, True, None, False, genome, GuardianBehaviors.COLONY, True)
    
    def build_new_queen_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, genome: Genome, position: Point, home_nest: Nest):
        return self.build_queen_ant(id, name, from_colony_id, owner_id, position, 0, None, home_nest, None, None, True, None, False, genome, None, False, GuardianBehaviors.NONE, False)
    
    def build_new_male_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, genome: Genome, position: Point, home_nest: Nest):
        return self.build_male_ant(id, name, from_colony_id, owner_id, position, 0, None, home_nest, None, None, True, None, False, genome, GuardianBehaviors.NONE, False)

    def build_warrior_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                          is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        memory = Memory(memory_data)
        stats = AntStats.build(AntTypes.WARRIOR, genome)
        body = WarriorAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = WarrirorAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = WarriorAnt(self._event_bus, EventEmitter(), id, name, from_colony_id, owner_id, body, mind)

        return ant
    
    def build_worker_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                         is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        memory = Memory(memory_data)
        stats = AntStats.build(AntTypes.WORKER, genome)
        body = WorkerAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = WorkerAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = WorkerAnt(self._event_bus, EventEmitter(), id, name, from_colony_id, owner_id, body, mind)

        return ant
    
    def build_queen_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                        is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, male_chromosomes_set: ChromosomesSet, is_in_nuptial_flight: bool,
                        guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        memory = Memory(memory_data)
        stats = AntStats.build(AntTypes.QUEEN, genome)
        body = QueenAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome, male_chromosomes_set, is_in_nuptial_flight)
        mind = QueenAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = QueenAnt(self._event_bus, EventEmitter(), id, name, from_colony_id, owner_id, body, mind)

        return ant
    
    def build_male_ant(self, id: int, name: str, from_colony_id: int, owner_id: int, position: Point, angle: int, hp: int, nest: Nest, located_in_nest: Nest, memory_data: dict, 
                          is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        memory = Memory(memory_data)
        stats = AntStats.build(AntTypes.MALE, genome)
        body = MaleAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = MaleAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = MaleAnt(self._event_bus, EventEmitter(), id, name, from_colony_id, owner_id, body, mind)

        return ant
    