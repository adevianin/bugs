from ..genes.base_gene import BaseGene
from typing import List

class Chromosome():

    @classmethod
    def build(cls, genes: List[BaseGene]):
        return Chromosome(genes)

    def __init__(self, genes: List[BaseGene]):
        self._genes = genes

    @property
    def genes(self):
        return self._genes