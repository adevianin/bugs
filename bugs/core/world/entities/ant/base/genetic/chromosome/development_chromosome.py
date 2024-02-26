from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.chromosome.chromosomes_types import ChromosomesTypes
from .base_chromosome import BaseChromosome
from ..genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from ..genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from ..genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene

class DevelopmentChromosome(BaseChromosome):

    @classmethod
    def build(cls, queen_cast_gene: DevelopmentQueenCasteGene, worker_cast_gene: DevelopmentWorkerCasteGene, warrior_cast_gene: DevelopmentWarriorCasteGene):
        return DevelopmentChromosome(queen_cast_gene, worker_cast_gene, warrior_cast_gene)

    def __init__(self, queen_cast_gene: DevelopmentQueenCasteGene, worker_cast_gene: DevelopmentWorkerCasteGene, warrior_cast_gene: DevelopmentWarriorCasteGene):
        super().__init__(ChromosomesTypes.DEVELOPMENT)
        self._queen_cast_gene = queen_cast_gene
        self._worker_cast_gene = worker_cast_gene
        self._warrior_cast_gene = warrior_cast_gene

    @property
    def queen_cast_gene(self) -> DevelopmentQueenCasteGene:
        return self._queen_cast_gene

    @property
    def worker_cast_gene(self) -> DevelopmentWorkerCasteGene:
        return self._worker_cast_gene

    @property
    def warrior_cast_gene(self) -> DevelopmentWarriorCasteGene:
        return self._warrior_cast_gene
    
    def merge_genes(self, another_chromosome: 'DevelopmentChromosome') -> List[BaseGene]:
        genes = []

        genes.append(self.queen_cast_gene.merge(another_chromosome.queen_cast_gene))
        genes.append(self.worker_cast_gene.merge(another_chromosome.worker_cast_gene))

        if self.warrior_cast_gene and another_chromosome.warrior_cast_gene:
            genes.append(self.warrior_cast_gene.merge(another_chromosome.warrior_cast_gene))
        elif self.warrior_cast_gene or another_chromosome.warrior_cast_gene:
            genes.append(self.warrior_cast_gene or another_chromosome.warrior_cast_gene)

        return genes
    
