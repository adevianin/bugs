from abc import ABC
from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes

class Chromosome(ABC):

    @classmethod
    def build(cls, genes: List[BaseGene]):
        return Chromosome(genes)

    def __init__(self, genes: List[BaseGene]):
        self._genes = genes

    @property
    def type(self):
        return self._type
    
    @property
    def genes(self):
        return self._genes
    
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

        return Chromosome.build(mutated_genes)