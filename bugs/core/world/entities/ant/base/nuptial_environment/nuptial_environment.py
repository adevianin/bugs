from .nuptial_male import NuptialMale
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genes.base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.chromosomes.body_chromosome import BodyChromosome
from core.world.entities.ant.base.genetic.genes.body_strength_gene import BodyStrengthGene
from core.world.entities.ant.base.genetic.genes.body_defense_gene import BodyDefenseGene
from core.world.entities.ant.base.genetic.genes.body_max_hp_gene import BodyMaxHpGene
from core.world.entities.ant.base.genetic.genes.body_hp_regen_rate_gene import BodyHpRegenRateGene
from core.world.entities.ant.base.genetic.genes.body_sight_distance_gene import BodySightDistanceGene
from core.world.entities.ant.base.genetic.genes.body_speed_gene import BodySpeedGene
from core.world.entities.ant.base.genetic.chromosomes.development_chromosome import DevelopmentChromosome
from core.world.entities.ant.base.genetic.genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from core.world.entities.ant.base.genetic.genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from core.world.entities.ant.base.genetic.chromosomes.adjusting_chromosome import AdjustingChromosome
from core.world.entities.ant.base.genetic.genes.adjusting_appetite_gene import AdjustingAppetiteGene
from core.world.entities.ant.base.genetic.genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene
from core.world.entities.ant.base.genetic.chromosomes.adaptation_chromosome import AdaptationChromosome
from core.world.entities.ant.base.genetic.chromosomes.building_chromosome import BuildingChromosome
from core.world.entities.ant.base.genetic.chromosomes.combat_chromosome import CombatChromosome
from core.world.entities.ant.base.genetic.genome import Genome
from typing import List
import random

class NuptialEnvironment():

    @classmethod
    def build(cls, owner_id: int, base_chromosomes_set: ChromosomesSet):
        return NuptialEnvironment(owner_id, base_chromosomes_set)

    def __init__(self, owner_id: int, base_chromosomes_set: ChromosomesSet):
        self._base_chromosomes_set = base_chromosomes_set
        self._owner_id = owner_id
        self._males = []

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def base_chromosomes_set(self):
        return self._base_chromosomes_set
    
    def get_male(self, male_id: str) -> NuptialMale:
        for male in self._males:
            if male.id == male_id:
                return male
        
        return None
    
    def search_males(self) -> List[NuptialMale]:
        male1 = self._generate_nuptial_male()
        male2 = self._generate_nuptial_male()
        male3 = self._generate_nuptial_male()

        self._males = [male1, male2, male3]

        return self._males
    
    def _generate_nuptial_male(self) -> NuptialMale:
        body_chromosome = self._generate_body_chromosome()
        development_chromosome = self._generate_development_chromosome()
        adaptation_chromosome = self._generate_adaptation_chromosome()
        building_chromosome = self._generate_building_chromosome()
        combat_chromosome = self._generate_combat_chromosome()
        adjusting_chromosome = self._generate_adjusting_chromosome()
        maternal_chromosome_set = ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
        genome = Genome.build(maternal_chromosome_set, None)
        return NuptialMale.build(genome)
    
    def _generate_body_chromosome(self) -> BodyChromosome:
        base_chromosome = self._base_chromosomes_set.body_chromosome
        deviation_percent = 20
        super_deviation_chance = 1
        super_deviation_percent = 60

        strength = self._deviate_value(base_chromosome.strength_gene.strength, deviation_percent, super_deviation_chance, super_deviation_percent)
        strength_gene = BodyStrengthGene.build(DominationCodes.random(), strength)

        defense = self._deviate_value(base_chromosome.defense_gene.defense, deviation_percent, super_deviation_chance, super_deviation_percent)
        defense_gene = BodyDefenseGene.build(DominationCodes.random(), defense)

        max_hp = self._deviate_value(base_chromosome.max_hp_gene.max_hp, deviation_percent, super_deviation_chance, super_deviation_percent)
        max_hp_gene = BodyMaxHpGene.build(DominationCodes.random(), max_hp)

        hp_regen_rate = self._deviate_value(base_chromosome.hp_regen_rate_gene.hp_regen_rate, deviation_percent, super_deviation_chance, super_deviation_percent)
        hp_regen_rate_gene = BodyHpRegenRateGene.build(DominationCodes.random(), hp_regen_rate)

        sight_distance = self._deviate_value(base_chromosome.sight_distance_gene.sight_distance, deviation_percent, super_deviation_chance, super_deviation_percent)
        sight_distance_gene = BodySightDistanceGene.build(DominationCodes.random(), sight_distance)

        speed = self._deviate_value(base_chromosome.speed_gene.speed, deviation_percent, super_deviation_chance, super_deviation_percent)
        speed_gene = BodySpeedGene.build(DominationCodes.random(), speed)

        return BodyChromosome.build(strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene)
    
    def _generate_development_chromosome(self) -> DevelopmentChromosome:
        base_development_chromosome = self._base_chromosomes_set.development_chromosome
        deviation_percent = 20
        super_deviation_chance = 1
        super_deviation_percent = 50

        base_queen_caste_gene = base_development_chromosome.queen_cast_gene
        strength = self._deviate_value(base_queen_caste_gene.strength, deviation_percent, super_deviation_chance, super_deviation_percent)
        defense = self._deviate_value(base_queen_caste_gene.defense, deviation_percent, super_deviation_chance, super_deviation_percent)
        max_hp = self._deviate_value(base_queen_caste_gene.max_hp, deviation_percent, super_deviation_chance, super_deviation_percent)
        hp_regen_rate = self._deviate_value(base_queen_caste_gene.hp_regen_rate, deviation_percent, super_deviation_chance, super_deviation_percent)
        speed = self._deviate_value(base_queen_caste_gene.speed, deviation_percent, super_deviation_chance, super_deviation_percent)
        queen_caste_gene = DevelopmentQueenCasteGene.build(DominationCodes.random(), strength, defense, max_hp, hp_regen_rate, speed)

        base_worker_cast_gene = base_development_chromosome.worker_cast_gene
        strength = self._deviate_value(base_worker_cast_gene.strength, deviation_percent, super_deviation_chance, super_deviation_percent)
        defense = self._deviate_value(base_worker_cast_gene.defense, deviation_percent, super_deviation_chance, super_deviation_percent)
        max_hp = self._deviate_value(base_worker_cast_gene.max_hp, deviation_percent, super_deviation_chance, super_deviation_percent)
        hp_regen_rate = self._deviate_value(base_worker_cast_gene.hp_regen_rate, deviation_percent, super_deviation_chance, super_deviation_percent)
        speed = self._deviate_value(base_worker_cast_gene.speed, deviation_percent, super_deviation_chance, super_deviation_percent)
        worker_caste_gene = DevelopmentWorkerCasteGene.build(DominationCodes.random(), strength, defense, max_hp, hp_regen_rate, speed)

        warrior_caste_gene = None
        if base_development_chromosome.warrior_cast_gene or self._check_can_develop_warrior():
            base_warrior_cast_gene = base_development_chromosome.warrior_cast_gene
            strength = self._deviate_value(base_warrior_cast_gene.strength, deviation_percent, super_deviation_chance, super_deviation_percent)
            defense = self._deviate_value(base_warrior_cast_gene.defense, deviation_percent, super_deviation_chance, super_deviation_percent)
            max_hp = self._deviate_value(base_warrior_cast_gene.max_hp, deviation_percent, super_deviation_chance, super_deviation_percent)
            hp_regen_rate = self._deviate_value(base_warrior_cast_gene.hp_regen_rate, deviation_percent, super_deviation_chance, super_deviation_percent)
            speed = self._deviate_value(base_warrior_cast_gene.speed, deviation_percent, super_deviation_chance, super_deviation_percent)
            warrior_caste_gene = DevelopmentWarriorCasteGene.build(DominationCodes.random(), strength, defense, max_hp, hp_regen_rate, speed)

        return DevelopmentChromosome.build(queen_caste_gene, worker_caste_gene, warrior_caste_gene)
    
    def _generate_adjusting_chromosome(self) -> AdjustingChromosome:
        base_adjusting_chromosome = self._base_chromosomes_set.adjusting_chromosome

        appetite_gene = AdjustingAppetiteGene.build(DominationCodes.random())
        appetite_development_gene = AdjustingDevelopmentAppetiteGene.build(DominationCodes.random())

        return AdjustingChromosome.build(appetite_gene, appetite_development_gene)
    
    def _generate_adaptation_chromosome(self) -> AdaptationChromosome:
        return AdaptationChromosome.build()
    
    def _generate_building_chromosome(self) -> BuildingChromosome:
        return BuildingChromosome.build()
    
    def _generate_combat_chromosome(self) -> CombatChromosome:
        return CombatChromosome.build()

    def _deviate_value(self, value, percent, super_deviation_chance, super_deviation_percent):
        is_super_deviation = random.random() <= super_deviation_chance / 100
        if is_super_deviation:
            percent = super_deviation_percent

        min_value = value * (100 - percent) / 100
        max_value = value * (100 + percent) / 100
        return random.uniform(min_value, max_value)
    
    def _check_can_develop_warrior(self):
        return True

    