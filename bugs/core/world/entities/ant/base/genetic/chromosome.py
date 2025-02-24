from abc import ABC
from typing import List, Dict
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from .chromosome_types import ChromosomeTypes
from .phenotype import Phenotype
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
from core.world.entities.ant.base.genetic.genes.adaptation_appetite_gene import AdaptationAppetiteGene
from core.world.entities.ant.base.genetic.genes.adaptation_development_appetite_gene import AdaptationDevelopmentAppetiteGene
from core.world.exceptions import GameError

class Chromosome(ABC):

    @staticmethod
    def build(type: ChromosomeTypes, genes: List[BaseGene]):
        return Chromosome(type, genes)
    
    @staticmethod
    def build_new_for_specie_body_chromosome():
        genes = [
            BodyStrengthGene.build_new_for_specie_gene(),
            BodyDefenseGene.build_new_for_specie_gene(),
            BodyMaxHpGene.build_new_for_specie_gene(),
            BodyHpRegenRateGene.build_new_for_specie_gene(),
            BodySightDistanceGene.build_new_for_specie_gene(),
            BodySpeedGene.build_new_for_specie_gene(),
            BodyLifeSpanGene.build_new_for_specie_gene()
        ]
        return Chromosome(ChromosomeTypes.BODY, genes)
    
    @staticmethod
    def build_new_for_specie_development_chromosome():
        genes = [
            DevelopmentQueenCasteGene.build_new_for_specie_gene(),
            DevelopmentMaleCasteGene.build_new_for_specie_gene(),
            DevelopmentWorkerCasteGene.build_new_for_specie_gene()
        ]
        return Chromosome(ChromosomeTypes.DEVELOPMENT, genes)
    
    @staticmethod
    def build_new_for_specie_adaptation_chromosome():
        genes = [
            AdaptationColdGene.build_new_for_specie_gene(),
            AdaptationAppetiteGene.build_new_for_specie_gene(),
            AdaptationDevelopmentAppetiteGene.build_new_for_specie_gene()
        ]
        return Chromosome(ChromosomeTypes.ADAPTATION, genes)
    
    @staticmethod
    def build_new_for_specie_specialization_chromosome():
        genes = []
        return Chromosome(ChromosomeTypes.SPECIALIZATION, genes)
    
    @staticmethod
    def build_new_for_specie_building_chromosome():
        genes = []
        return Chromosome(ChromosomeTypes.BUILDING, genes)
    
    @staticmethod
    def build_new_for_specie_combat_chromosome():
        genes = []
        return Chromosome(ChromosomeTypes.COMBAT, genes)
    
    def __init__(self, type: ChromosomeTypes, genes: List[BaseGene]):
        self._type = type
        self._genes = genes

    @property
    def type(self):
        return self._type
    
    @property
    def genes(self) -> List[BaseGene]:
        return self._genes
    
    def merge(self, another_chromosome: 'Chromosome') -> 'Chromosome':
        all_genes = self.genes + another_chromosome.genes
        genes_by_types: Dict[GenesTypes, List[BaseGene]] = {}
        for gene in all_genes:
            genes_by_type: List[BaseGene] = genes_by_types.get(gene.type, [])
            genes_by_type.append(gene)
            genes_by_types[gene.type] = genes_by_type

        merged_genes: List[BaseGene] = []
        for type in genes_by_types:
            genes_by_type = genes_by_types[type]
            if len(genes_by_type) == 1:
                merged_genes.append(genes_by_type[0])
            elif len(genes_by_type) == 2:
                gene1 = genes_by_type[0]
                gene2 = genes_by_type[1]
                merged_genes.append(gene1.merge(gene2))
            else:
                raise GameError('invalid genes count')
            
        return Chromosome.build(self.type, merged_genes)
    
    def affect_phenotype(self, phenotype: Phenotype):
        for gene in self._genes:
            gene.affect(phenotype)
    
    def get_gene_by_type(self, type: GenesTypes):
        for gene in self._genes:
            if gene.type == type:
                return gene
            
        return None
    
    def has_gene(self, type: GenesTypes):
        return self.get_gene_by_type(type) is not None
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'Chromosome':
        mutated_genes = []
        for gene in self._genes:
            mutated_genes.append(gene.mutate(percent, super_mutate_chance, super_mutate_percent))

        return Chromosome.build(self.type, mutated_genes)
    
    def inject_gene(self, injecting_gene: BaseGene):
        gene_with_same_type = self.get_gene_by_type(injecting_gene.type)
        if gene_with_same_type:
            self._genes.remove(gene_with_same_type)
        self._genes.append(injecting_gene)