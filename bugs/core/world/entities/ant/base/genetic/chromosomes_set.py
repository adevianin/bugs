from .chromosome import Chromosome
from typing import List, Dict
from .chromosome_types import ChromosomeTypes
from .phenotype import Phenotype
from .genes.base.genes_types import GenesTypes
from core.world.exceptions import GameError

class ChromosomesSet():

    @classmethod
    def build(cls, chromosomes: List[Chromosome]):
        return ChromosomesSet(chromosomes)
    
    @staticmethod
    def build_new_for_specie():
        return ChromosomesSet([
            Chromosome.build_new_for_specie_body_chromosome(),
            Chromosome.build_new_for_specie_development_chromosome(),
            Chromosome.build_new_for_specie_adaptation_chromosome(),
            Chromosome.build_new_for_specie_specialization_chromosome(),
            Chromosome.build_new_for_specie_building_chromosome(),
            Chromosome.build_new_for_specie_combat_chromosome()
        ])

    def __init__(self, chromosomes: List[Chromosome]):
        self._chromosomes = chromosomes

    @property
    def chromosomes(self) -> List[Chromosome]:
        return self._chromosomes
    
    def merge(self, another_chromosomes_set: 'ChromosomesSet') -> 'ChromosomesSet':
        chromosomes_by_types: Dict[ChromosomeTypes, List[Chromosome]] = {}
        all_chromosomes = self.chromosomes + another_chromosomes_set.chromosomes
        for chromosome in all_chromosomes:
            chromosomes_by_type = chromosomes_by_types.get(chromosome.type, [])
            chromosomes_by_type.append(chromosome)
            chromosomes_by_types[chromosome.type] = chromosomes_by_type

        merged_chromosomes: List[Chromosome] = []
        for type in chromosomes_by_types:
            chromosomes_by_type = chromosomes_by_types[type]
            if len(chromosomes_by_type) == 2:
                chromosome1 = chromosomes_by_type[0]
                chromosome2 = chromosomes_by_type[1]
                merged_chromosome = chromosome1.merge(chromosome2)
                merged_chromosomes.append(merged_chromosome)
            else:
                raise GameError('invalid count of chromosomes')
        
        return ChromosomesSet.build(merged_chromosomes)
    
    def affect_phenotype(self, phenotype: Phenotype):
        body_chromosome = self._get_chromosome_by_type(ChromosomeTypes.BODY)
        development_chromosome = self._get_chromosome_by_type(ChromosomeTypes.DEVELOPMENT)
        specialization_chromosome = self._get_chromosome_by_type(ChromosomeTypes.SPECIALIZATION)
        building_chromosome = self._get_chromosome_by_type(ChromosomeTypes.BUILDING)
        combat_chromosome = self._get_chromosome_by_type(ChromosomeTypes.COMBAT)
        adaptation_chromosome = self._get_chromosome_by_type(ChromosomeTypes.ADAPTATION)
        body_chromosome.affect_phenotype(phenotype)
        development_chromosome.affect_phenotype(phenotype)
        adaptation_chromosome.affect_phenotype(phenotype)
        specialization_chromosome.affect_phenotype(phenotype)
        building_chromosome.affect_phenotype(phenotype)
        combat_chromosome.affect_phenotype(phenotype)
        

    def has_gene(self, gene_type: GenesTypes):
        for chromosome in self._chromosomes:
            if chromosome.has_gene(gene_type):
                return True
        
        return False

    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'ChromosomesSet':
        mutated_chromosomes = []
        for chromosome in self._chromosomes:
            mutated_chromosomes.append(chromosome.mutate(percent, super_mutate_chance, super_mutate_percent))
        
        return ChromosomesSet.build(mutated_chromosomes)
    
    def _get_chromosome_by_type(self, type: ChromosomeTypes):
        for chromosome in self._chromosomes:
            if chromosome.type == type:
                return chromosome
            
        raise GameError('chromosome is not found')
    