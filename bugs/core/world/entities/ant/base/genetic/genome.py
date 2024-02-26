from .chromosomes_set import ChromosomesSet
from .phenotype import Phenotype
from .genes.base.base_gene import BaseGene
from core.world.entities.ant.base.ant_types import AntTypes

from typing import List
import random

class Genome():

    @classmethod
    def build(cls, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        return Genome(maternal_chromosomes_set, paternal_chromosomes_set)

    def __init__(self, maternal_chromosomes_set: ChromosomesSet, paternal_chromosomes_set: ChromosomesSet):
        self._maternal_chromosomes_set = maternal_chromosomes_set
        self._paternal_chromosomes_set = paternal_chromosomes_set

    @property
    def maternal_chromosomes_set(self) -> ChromosomesSet:
        return self._maternal_chromosomes_set
    
    @property
    def paternal_chromosomes_set(self) -> ChromosomesSet:
        return self._paternal_chromosomes_set
    
    def meiosis(self) -> ChromosomesSet:
        base_chromosome = random.choice([self._maternal_chromosomes_set.body_chromosome, self._paternal_chromosomes_set.body_chromosome])
        development_chromosome = random.choice([self._maternal_chromosomes_set.development_chromosome, self._paternal_chromosomes_set.development_chromosome])
        adaptation_chromosome = random.choice([self._maternal_chromosomes_set.adaptation_chromosome, self._paternal_chromosomes_set.adaptation_chromosome])
        building_chromosome = random.choice([self._maternal_chromosomes_set.building_chromosome, self._paternal_chromosomes_set.building_chromosome])
        combat_chromosome = random.choice([self._maternal_chromosomes_set.combat_chromosome, self._paternal_chromosomes_set.combat_chromosome])
        adjusting_chromosome = random.choice([self._maternal_chromosomes_set.adjusting_chromosome, self._paternal_chromosomes_set.adjusting_chromosome])
        return ChromosomesSet.build(base_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
    
    def generate_phenotype(self, ant_type: AntTypes) -> Phenotype:
        phenotype = Phenotype.build_empty(ant_type)
        genes: List[BaseGene] = []
        genes += self._maternal_chromosomes_set.body_chromosome.merge_genes(self._paternal_chromosomes_set.body_chromosome)
        genes += self._maternal_chromosomes_set.development_chromosome.merge_genes(self._paternal_chromosomes_set.development_chromosome)
        genes += self._maternal_chromosomes_set.adaptation_chromosome.merge_genes(self._paternal_chromosomes_set.adaptation_chromosome)
        genes += self._maternal_chromosomes_set.building_chromosome.merge_genes(self._paternal_chromosomes_set.building_chromosome)
        genes += self._maternal_chromosomes_set.combat_chromosome.merge_genes(self._paternal_chromosomes_set.combat_chromosome)
        genes += self._maternal_chromosomes_set.adjusting_chromosome.merge_genes(self._paternal_chromosomes_set.adjusting_chromosome)

        for gene in genes:
            gene.affect(phenotype)

        return phenotype


