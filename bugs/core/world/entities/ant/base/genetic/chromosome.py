from abc import ABC
from typing import List, Dict
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from .chromosome_types import ChromosomeTypes
from .phenotype import Phenotype

class Chromosome(ABC):

    @classmethod
    def build(cls, type: ChromosomeTypes, genes: List[BaseGene]):
        return Chromosome(type, genes)

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
                raise Exception('invalid genes count')
            
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

        return Chromosome.build(mutated_genes)