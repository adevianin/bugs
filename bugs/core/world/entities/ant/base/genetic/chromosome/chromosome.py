from ..genes.base_gene import BaseGene
from ..genes.genes_types import GenesTypes
from typing import List, Dict

class Chromosome():

    @classmethod
    def build(cls, genes: List[BaseGene]):
        return Chromosome(genes)

    def __init__(self, genes: List[BaseGene]):
        self._genes = genes

    @property
    def genes(self):
        return self._genes
    
    def merge_genes(self, chromosome: 'Chromosome') -> List[BaseGene]:
        genes_map: Dict[GenesTypes, List[BaseGene]] = {}

        for gene in self.genes + chromosome.genes:
            if gene.type not in genes_map:
                genes_map[gene.type] = []

            genes_map[gene.type].append(gene)

        result = []
        for gene_type in genes_map:
            genes_map_item = genes_map[gene_type]
            if len(genes_map_item) == 1:
                result.append(genes_map_item[0])
            elif len(genes_map_item) == 2:
                gene1: BaseGene = genes_map_item[0]
                gene2: BaseGene = genes_map_item[1]
                result.append(gene1.merge(gene2))
            else:
                raise Exception('incorrect count of genes')
            
        return result


