from .specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from typing import List

class SpecieChromosomeSet():

    @classmethod
    def build(self, specie_chromosomes: List[SpecieChromosome]):
        return SpecieChromosomeSet(specie_chromosomes)

    def __init__(self, specie_chromosomes: List[SpecieChromosome]):
        self._specie_chromosomes = specie_chromosomes

    @property
    def specie_chromosomes(self) -> List[SpecieChromosome]:
        return self._specie_chromosomes
    
    def accept_chromosome_set(self, chromosome_set: ChromosomesSet):
        for chromosome in chromosome_set.chromosomes:
            specie_chromosome = self.get_specie_chromosome_by_type(chromosome.type)
            specie_chromosome.accept_chromosome(chromosome)
    
    def generate_chorosome_set(self, percent: int, super_mutate_chance: int, super_mutate_percent: int, super_gene: BaseGene) -> ChromosomesSet:
        generated_chromosomes = []
        for specie_chromosome in self._specie_chromosomes:
            super_gene = super_gene if super_gene and specie_chromosome.type == super_gene.chromosome_type else None
            chromosome = specie_chromosome.generate_chromosome(percent, super_mutate_chance, super_mutate_percent, super_gene)
            generated_chromosomes.append(chromosome)

        return ChromosomesSet.build(generated_chromosomes)
    
    def get_specie_chromosome_by_type(self, type: ChromosomeTypes) -> SpecieChromosome:
        for specie_chromosome in self._specie_chromosomes:
            if specie_chromosome.type == type:
                return specie_chromosome
            
        return None
    
    def check_gene_presence(self, gene_type: GenesTypes):
        for specie_chromosome in self._specie_chromosomes:
            if specie_chromosome.check_gene_presence(gene_type):
                return True
            
        return False
    
    def get_activated_specie_gene_by_type(self, gene_type: GenesTypes):
        for specie_chromosome in self._specie_chromosomes:
            specie_gene = specie_chromosome.get_activated_specie_gene_by_type(gene_type)
            if specie_gene:
                return specie_gene
            
        return None