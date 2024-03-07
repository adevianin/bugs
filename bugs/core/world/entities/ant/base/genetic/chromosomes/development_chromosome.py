from typing import List
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome
from ..genes.development_queen_caste_gene import DevelopmentQueenCasteGene
from ..genes.development_worker_caste_gene import DevelopmentWorkerCasteGene
from ..genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
from ..genes.development_male_caste_gene import DevelopmentMaleCasteGene


class DevelopmentChromosome(BaseChromosome):

    @classmethod
    def build(cls, queen_cast_gene: DevelopmentQueenCasteGene, worker_cast_gene: DevelopmentWorkerCasteGene, male_cast_gene: DevelopmentMaleCasteGene, warrior_cast_gene: DevelopmentWarriorCasteGene):
        return DevelopmentChromosome(queen_cast_gene, worker_cast_gene, male_cast_gene, warrior_cast_gene)

    def __init__(self, queen_cast_gene: DevelopmentQueenCasteGene, worker_cast_gene: DevelopmentWorkerCasteGene, male_cast_gene: DevelopmentMaleCasteGene, warrior_cast_gene: DevelopmentWarriorCasteGene):
        super().__init__(ChromosomesTypes.DEVELOPMENT)
        self._queen_cast_gene = queen_cast_gene
        self._worker_cast_gene = worker_cast_gene
        self._warrior_cast_gene = warrior_cast_gene
        self._male_cast_gene = male_cast_gene

    @property
    def queen_cast_gene(self) -> DevelopmentQueenCasteGene:
        return self._queen_cast_gene

    @property
    def worker_cast_gene(self) -> DevelopmentWorkerCasteGene:
        return self._worker_cast_gene

    @property
    def male_cast_gene(self) -> DevelopmentMaleCasteGene:
        return self._male_cast_gene
    
    @property
    def warrior_cast_gene(self) -> DevelopmentWarriorCasteGene:
        return self._warrior_cast_gene
    
    def merge(self, another_chromosome: 'DevelopmentChromosome') -> 'DevelopmentChromosome':
        queen_cast_gene = self.queen_cast_gene.merge(another_chromosome.queen_cast_gene)
        worker_cast_gene = self.worker_cast_gene.merge(another_chromosome.worker_cast_gene)
        male_cast_gene = self.male_cast_gene.merge(another_chromosome.male_cast_gene)

        warrior_cast_gene = None
        if self.warrior_cast_gene and another_chromosome.warrior_cast_gene:
            warrior_cast_gene = self.warrior_cast_gene.merge(another_chromosome.warrior_cast_gene)
        elif self.warrior_cast_gene or another_chromosome.warrior_cast_gene:
            warrior_cast_gene = self.warrior_cast_gene or another_chromosome.warrior_cast_gene

        return DevelopmentChromosome.build(queen_cast_gene, worker_cast_gene, male_cast_gene, warrior_cast_gene)
    
    def affect_phenotype(self, phenotype: Phenotype):
        self._queen_cast_gene.affect(phenotype)
        self._worker_cast_gene.affect(phenotype)
        self._male_cast_gene.affect(phenotype)
        if self._warrior_cast_gene:
            self._warrior_cast_gene.affect(phenotype)
    