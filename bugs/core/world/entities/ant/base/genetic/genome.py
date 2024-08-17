from .chromosomes_set import ChromosomesSet
from .phenotype import Phenotype
from core.world.entities.ant.base.ant_types import AntTypes
from .genes.base.genes_types import GenesTypes
from .chromosome_types import ChromosomeTypes
from .chromosome import Chromosome

from typing import List, Dict
import random

class Genome():

    @classmethod
    def build(cls, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        return Genome(maternal_chromosomes_set, paternal_chromosomes_set)

    def __init__(self, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        self._maternal = maternal_chromosomes_set
        self._paternal = paternal_chromosomes_set

    @property
    def maternal_chromosomes_set(self) -> ChromosomesSet:
        return self._maternal
    
    @property
    def paternal_chromosomes_set(self) -> ChromosomesSet:
        return self._paternal
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int):
        maternal_chromosomes_set = self._maternal.mutate(percent, super_mutate_chance, super_mutate_percent)
        paternal_chromosomes_set = self._paternal.mutate(percent, super_mutate_chance, super_mutate_percent) if self._paternal else None
        return Genome.build(maternal_chromosomes_set, paternal_chromosomes_set)
    
    def meiosis(self) -> ChromosomesSet:
        all_chromosomes = self._maternal.chromosomes + self._paternal.chromosomes
        chromosomes_by_types: Dict[ChromosomeTypes, List[Chromosome]] = {}

        for chromosome in all_chromosomes:
            chromosomes_by_type = chromosomes_by_types.get(chromosome.type, [])
            chromosomes_by_type.append(chromosome)
            chromosomes_by_types[chromosome.type] = chromosomes_by_type

        choosed_chomosomes = []
        for chromosome_type in chromosomes_by_types:
            chromosomes_by_type = chromosomes_by_types[chromosome_type]

            chromosome1 = chromosomes_by_type[0]
            chromosome2 = chromosomes_by_type[1]
            choosed_chomosomes.append(random.choice([chromosome1, chromosome2]))

        return ChromosomesSet.build(choosed_chomosomes)
    
    def generate_phenotype(self, ant_type: AntTypes) -> Phenotype:
        phenotype = Phenotype.build_empty(ant_type)
        
        if self._paternal is not None:
            merged_chromosomes_set = self._paternal.merge(self._maternal)
            merged_chromosomes_set.affect_phenotype(phenotype)
        else:
            self._maternal.affect_phenotype(phenotype)

        return phenotype
    
    def get_avaliable_ant_types(self):
        res = []

        if self._paternal is None:
            if self.check_gene_presence(GenesTypes.DEVELOPMENT_MALE_CASTE):
                res.append(AntTypes.MALE)
        else:
            if self.check_gene_presence(GenesTypes.DEVELOPMENT_WORKER_CASTE):
                res.append(AntTypes.WORKER)

            if self.check_gene_presence(GenesTypes.DEVELOPMENT_QUEEN_CASTE):
                res.append(AntTypes.QUEEN)

            if self.check_gene_presence(GenesTypes.DEVELOPMENT_WARRIOR_CASTE):
                res.append(AntTypes.WARRIOR)

        return res

    def check_gene_presence(self, gene_type: GenesTypes):
        is_in_maternal = self._maternal.has_gene(gene_type)
        is_in_paternal = self._paternal.has_gene(gene_type) if self._paternal is not None else False
        return is_in_maternal or is_in_paternal
    