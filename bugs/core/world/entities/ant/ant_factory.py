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
from core.world.entities.ant.base.genetic.genes.base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.chromosome import Chromosome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.ant_stats import AntStats
from .male.male_ant_mind import MaleAntMind
from .male.male_ant_body import MaleAntBody
from .male.male_ant import MaleAnt
from .base.guardian_behaviors import GuardianBehaviors
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.ant.base.larva import Larva
from core.world.entities.ant.base.genetic.genes.body_strength_gene import BodyStrengthGene
from core.world.entities.ant.base.genetic.genes.body_defense_gene import BodyDefenseGene
from core.world.entities.ant.base.genetic.genes.body_max_hp_gene import BodyMaxHpGene
from core.world.entities.ant.base.genetic.genes.body_hp_regen_rate_gene import BodyHpRegenRateGene
from core.world.entities.ant.base.genetic.genes.body_sight_distance_gene import BodySightDistanceGene
from core.world.entities.ant.base.genetic.genes.body_speed_gene import BodySpeedGene
from core.world.entities.ant.base.genetic.genes.body_life_span_gene import BodyLifeSpanGene
from core.world.entities.ant.base.genetic.genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from core.world.entities.ant.base.genetic.genes.development_male_caste_gene import DevelopmentMaleCasteGene
from core.world.entities.ant.base.genetic.genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from core.world.entities.ant.base.genetic.genes.adaptation_cold_gene import AdaptationColdGene
from core.world.entities.ant.base.genetic.genes.adjusting_appetite_gene import AdjustingAppetiteGene
from core.world.entities.ant.base.genetic.genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene

class AntFactory():

    def __init__(self, event_bus: EventEmitter, thought_factory: ThoughtFactory):
        self._event_bus = event_bus
        self._thought_factory = thought_factory

    def build_new_ant(self, id: int, name: str, ownership: OwnershipConfig, genome: Genome, ant_type: AntTypes, position: Point, birth_step: int, home_nest: Nest = None):
        match(ant_type):
            case AntTypes.WORKER:
                return self.build_new_worker_ant(id, name, ownership, genome, position, home_nest, birth_step)
            case AntTypes.WARRIOR:    
                return self.build_new_warrior_ant(id, name, ownership, genome, position, home_nest, birth_step)
            case AntTypes.QUEEN:    
                return self.build_new_queen_ant(id, name, ownership, genome, position, home_nest, birth_step)
            case AntTypes.MALE:    
                return self.build_new_male_ant(id, name, ownership, genome, position, home_nest, birth_step)

    def build_new_worker_ant(self, id: int, name: str, ownership: OwnershipConfig, genome: Genome, position: Point, home_nest: Nest, birth_step: int):
        return self.build_worker_ant(id, name, ownership, position, 0, None, birth_step, home_nest, None, Memory(), True, None, False, genome, GuardianBehaviors.NEST, True)
    
    def build_new_warrior_ant(self, id: int, name: str, ownership: OwnershipConfig, genome: Genome, position: Point, home_nest: Nest, birth_step: int):
        return self.build_warrior_ant(id, name, ownership, position, 0, None, birth_step, home_nest, None, Memory(), True, None, False, genome, GuardianBehaviors.COLONY, True)
    
    def build_new_queen_ant(self, id: int, name: str, ownership: OwnershipConfig, genome: Genome, position: Point, home_nest: Nest, birth_step: int):
        return self.build_queen_ant(id, name, ownership, position, 0, None, birth_step, home_nest, None, Memory(), True, None, False, genome, None, False, GuardianBehaviors.NONE, False)
    
    def build_new_male_ant(self, id: int, name: str, ownership: OwnershipConfig, genome: Genome, position: Point, home_nest: Nest, birth_step: int):
        return self.build_male_ant(id, name, ownership, position, 0, None, birth_step, home_nest, None, Memory(), True, None, False, genome, GuardianBehaviors.NONE, False)

    def build_warrior_ant(self, id: int, name: str, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, nest: Nest, 
                          located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome,
                          guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = AntStats.build(AntTypes.WARRIOR, genome)
        hp = stats.max_hp if hp is None else hp
        body = WarriorAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, birth_step, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = WarrirorAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = WarriorAnt(self._event_bus, EventEmitter(), id, name, ownership, body, mind)

        return ant
    
    def build_worker_ant(self, id: int, name: str, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, nest: Nest, 
                         located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome,
                         guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = AntStats.build(AntTypes.WORKER, genome)
        hp = stats.max_hp if hp is None else hp
        body = WorkerAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, birth_step, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = WorkerAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = WorkerAnt(self._event_bus, EventEmitter(), id, name, ownership, body, mind)

        return ant
    
    def build_queen_ant(self, id: int, name: str, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, nest: Nest, 
                        located_in_nest: Nest, memory: Memory, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, 
                        male_chromosomes_set: ChromosomesSet, is_in_nuptial_flight: bool, guardian_behavior: GuardianBehaviors, is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = AntStats.build(AntTypes.QUEEN, genome)
        hp = stats.max_hp if hp is None else hp
        body = QueenAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, birth_step, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome, male_chromosomes_set, is_in_nuptial_flight)
        mind = QueenAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = QueenAnt(self._event_bus, EventEmitter(), id, name, ownership, body, mind)

        return ant
    
    def build_male_ant(self, id: int, name: str, ownership: OwnershipConfig, position: Point, angle: int, hp: int, birth_step: int, nest: Nest, located_in_nest: Nest, 
                       memory: Memory, is_auto_thought_generation: bool, picked_item: Item, is_in_operation: bool, genome: Genome, guardian_behavior: GuardianBehaviors, 
                       is_cooperative: bool):
        sayer = EventEmitter()
        visual_sensor = VisualSensor()
        temperature_sensor = TemperatureSensor()
        stats = AntStats.build(AntTypes.MALE, genome)
        hp = stats.max_hp if hp is None else hp
        body = MaleAntBody(EventEmitter(), stats, sayer, memory, position, angle, hp, birth_step, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        mind = MaleAntMind(body, self._thought_factory, is_auto_thought_generation, nest, is_in_operation, guardian_behavior, is_cooperative)
        ant = MaleAnt(self._event_bus, EventEmitter(), id, name, ownership, body, mind)

        return ant
    
    def build_starter_queen_larva(self):
        strength_gene = BodyStrengthGene.build(DominationCodes.random(), 10)
        defense_gene = BodyDefenseGene.build(DominationCodes.random(), 20)
        max_hp_gene = BodyMaxHpGene.build(DominationCodes.random(), 100)
        hp_regen_rate_gene = BodyHpRegenRateGene.build(DominationCodes.random(), 5)
        sight_distance_gene = BodySightDistanceGene.build(DominationCodes.random(), 150)
        speed_gene = BodySpeedGene.build(DominationCodes.random(), 50)
        life_span_gene = BodyLifeSpanGene.build(DominationCodes.random(), 10000)
        body_chromosome = Chromosome(ChromosomeTypes.BODY, [strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene, life_span_gene])
        
        queen_gene = DevelopmentQueenCasteGene(DominationCodes.random(), 1, 0.5, 2, 1, 0.5)
        male_gene = DevelopmentMaleCasteGene(DominationCodes.random(), 1, 1, 0.7, 1, 1)
        worker_gene = DevelopmentWorkerCasteGene(DominationCodes.random(), 1, 1, 1, 1, 1)
        development_chromosome = Chromosome(ChromosomeTypes.DEVELOPMENT, [queen_gene, male_gene, worker_gene])

        adaptation_cold = AdaptationColdGene.build(DominationCodes.random(), 50)
        adaptation_chromosome = Chromosome(ChromosomeTypes.ADAPTATION, [adaptation_cold])

        building_chromosome = Chromosome(ChromosomeTypes.BUILDING, [])
        combat_chromosome = Chromosome(ChromosomeTypes.COMBAT, [])

        apetite_gene = AdjustingAppetiteGene(DominationCodes.random())
        dev_apetite_gene = AdjustingDevelopmentAppetiteGene(DominationCodes.random())
        adjusting_chromosome = Chromosome(ChromosomeTypes.ADJUSTING, [apetite_gene, dev_apetite_gene])
        maternal_chromosome_set = ChromosomesSet.build([body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome])
        
        
        strength_gene = BodyStrengthGene.build(DominationCodes.random(), 8)
        defense_gene = BodyDefenseGene.build(DominationCodes.random(), 10)
        max_hp_gene = BodyMaxHpGene.build(DominationCodes.random(), 150)
        hp_regen_rate_gene = BodyHpRegenRateGene.build(DominationCodes.random(), 7)
        sight_distance_gene = BodySightDistanceGene.build(DominationCodes.random(), 200)
        speed_gene = BodySpeedGene.build(DominationCodes.random(), 45)
        life_span_gene = BodyLifeSpanGene.build(DominationCodes.random(), 11000)
        body_chromosome = Chromosome(ChromosomeTypes.BODY, [strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene, life_span_gene])
        
        queen_gene = DevelopmentQueenCasteGene(DominationCodes.random(), 1, 0.5, 2, 1, 0.5)
        male_gene = DevelopmentMaleCasteGene(DominationCodes.random(), 1, 1, 0.7, 1, 1)
        worker_gene = DevelopmentWorkerCasteGene(DominationCodes.random(), 1, 1, 1, 1, 1)
        development_chromosome = Chromosome(ChromosomeTypes.DEVELOPMENT, [queen_gene, male_gene, worker_gene])

        adaptation_cold = AdaptationColdGene.build(DominationCodes.random(), 50)
        adaptation_chromosome = Chromosome(ChromosomeTypes.ADAPTATION, [adaptation_cold])

        building_chromosome = Chromosome(ChromosomeTypes.BUILDING, [])
        combat_chromosome = Chromosome(ChromosomeTypes.COMBAT, [])

        apetite_gene = AdjustingAppetiteGene(DominationCodes.random())
        dev_apetite_gene = AdjustingDevelopmentAppetiteGene(DominationCodes.random())
        adjusting_chromosome = Chromosome(ChromosomeTypes.ADJUSTING, [apetite_gene, dev_apetite_gene])
        paternal_chromosome_set = ChromosomesSet.build([body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome])

        genome = Genome.build(maternal_chromosome_set, paternal_chromosome_set)
        larva = Larva.build_new('Antara', AntTypes.QUEEN, genome)

        return larva
    
    
    