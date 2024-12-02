from .specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from .activity_weights_pack import ActivityWeightsPack
from core.world.settings import (PROBABILITY_OF_SUPER_GENE, SUPER_GENE_THRESHOLD_BODY_STRENGTH, SUPER_GENE_THRESHOLD_BODY_DEFENSE, SUPER_GENE_THRESHOLD_BUILDING_SUBNEST, 
                                 SUPER_GENE_THRESHOLD_ADAPTATION_COLD)
from core.world.utils.probability_check import probability_check
from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from core.world.entities.ant.base.genetic.genes.building_subnest_gene import BuildingSubnestGene
from .required_genes_list import REQUIRED_GENES
from typing import List, Dict
import random

class Specie():

    @classmethod
    def build(self, chromosome_set: SpecieChromosomeSet, activity_weights: ActivityWeightsPack):
        return Specie(chromosome_set, activity_weights)
    
    def build_new() -> 'Specie':
        chromosome_set = ChromosomesSet.build_new_for_specie().mutate(10, 10, 15)
        specie_chromosome_set = SpecieChromosomeSet.build_new(chromosome_set)
        activity_weights = ActivityWeightsPack.build_empty()
        return Specie(specie_chromosome_set, activity_weights)

    def __init__(self, chromosome_set: SpecieChromosomeSet, activity_weights: ActivityWeightsPack):
        self._chromosome_set = chromosome_set
        self._activity_weights = activity_weights

    @property
    def activity_weights(self) -> ActivityWeightsPack:
        return self._activity_weights

    @property
    def specie_chromosome_set(self) -> SpecieChromosomeSet:
        return self._chromosome_set
    
    @property
    def _activity_value(self):
        return 1
    
    def accept_male_genome(self, genome: Genome):
        maternal_chromosome_set = genome.maternal_chromosomes_set
        self._chromosome_set.accept_chromosome_set(maternal_chromosome_set)
    
    def generate_nuptial_male_genome(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> Genome:
        super_gene = self._build_super_gene_by_specie_activity() if probability_check(PROBABILITY_OF_SUPER_GENE) else None
        maternal_chromosome = self._chromosome_set.generate_chorosome_set(percent, super_mutate_chance, super_mutate_percent, super_gene)
        return Genome.build(maternal_chromosome, None)
    
    def generate_antara_genome(self) -> Genome:
        percent = 5
        super_mutate_chance = 0
        super_mutate_percent = 0
        maternal_chromosome = self._chromosome_set.generate_chorosome_set(percent, super_mutate_chance, super_mutate_percent)
        paternal_chromosome = self._chromosome_set.generate_chorosome_set(percent, super_mutate_chance, super_mutate_percent)
        return Genome.build(maternal_chromosome, paternal_chromosome)
    
    def apply_schema(self, schema: Dict[ChromosomeTypes, List[str]]):
        for chromosome_type in schema:
            ids = schema[chromosome_type]
            specie_chromosome = self._chromosome_set.get_specie_chromosome_by_type(chromosome_type)
            specie_chromosome.apply_schema(ids)
        
    def validate_schema(self, schema: Dict[ChromosomeTypes, List[str]]):
        validating_chromosome_types = []

        for chromosome_type in schema:
            validating_chromosome_types.append(chromosome_type)
            schema_ids = schema[chromosome_type]
            specie_chromosome = self._chromosome_set.get_specie_chromosome_by_type(chromosome_type)

            if not specie_chromosome.validate_schema(schema_ids):
                return False
            
        for chromosome_type in REQUIRED_GENES.keys():
            if chromosome_type not in validating_chromosome_types:
                return False

        return True
    
    def check_gene_presence(self, gene_type: GenesTypes):
        return self._chromosome_set.check_gene_presence(gene_type)
    
    def register_attack_activity(self):
        self._activity_weights.attack_weight += self._activity_value
    
    def register_defense_activity(self):
        self._activity_weights.defense_weight += self._activity_value
    
    def register_cold_resistance_activity(self):
        self._activity_weights.cold_resistance_weight += self._activity_value
    
    def register_building_activity(self):
        self._activity_weights.building_weight += self._activity_value

    def _build_super_gene_by_specie_activity(self) -> GenesTypes:
        genes = []

        if self._activity_weights.attack_weight >= SUPER_GENE_THRESHOLD_BODY_STRENGTH:
            genes.append(GenesTypes.BODY_STRENGTH)

        if self._activity_weights.attack_weight >= SUPER_GENE_THRESHOLD_BODY_STRENGTH and not self.check_gene_presence(GenesTypes.DEVELOPMENT_WARRIOR_CASTE):
            genes.append(GenesTypes.DEVELOPMENT_WARRIOR_CASTE)

        if self._activity_weights.defense_weight >= SUPER_GENE_THRESHOLD_BODY_DEFENSE:
            genes.append(GenesTypes.BODY_DEFENSE)

        if self._activity_weights.building_weight >= SUPER_GENE_THRESHOLD_BUILDING_SUBNEST and not self.check_gene_presence(GenesTypes.BUILDING_SUBNEST):
            genes.append(GenesTypes.BUILDING_SUBNEST)

        if self._activity_weights.cold_resistance_weight >= SUPER_GENE_THRESHOLD_ADAPTATION_COLD:
            genes.append(GenesTypes.ADAPTATION_COLD)

        if len(genes) == 0:
            return None
        
        choosen_gene_type = random.choice(genes)

        match (choosen_gene_type):
            case GenesTypes.BODY_STRENGTH:
                self._activity_weights.attack_weight = 0
                specie_gene = self._chromosome_set.get_activated_specie_gene_by_type(GenesTypes.BODY_STRENGTH)
                return specie_gene.gene.upgrade()
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                self._activity_weights.attack_weight = 0
                return DevelopmentWarriorCasteGene.build_new_for_specie_gene()
            case GenesTypes.BODY_DEFENSE:
                self._activity_weights.defense_weight = 0
                specie_gene = self._chromosome_set.get_activated_specie_gene_by_type(GenesTypes.BODY_DEFENSE)
                return specie_gene.gene.upgrade()
            case GenesTypes.BUILDING_SUBNEST:
                self._activity_weights.building_weight = 0
                return BuildingSubnestGene.build_new_for_specie_gene()
            case GenesTypes.ADAPTATION_COLD:
                self._activity_weights.cold_resistance_weight = 0
                specie_gene = self._chromosome_set.get_activated_specie_gene_by_type(GenesTypes.ADAPTATION_COLD)
                return specie_gene.gene.upgrade()
