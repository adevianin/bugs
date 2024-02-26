from ..genes.base.base_gene import BaseGene
from ..genes.base.genes_types import GenesTypes
from abc import ABC, abstractmethod
from typing import List, Dict
from .chromosomes_types import ChromosomesTypes

class BaseChromosome(ABC):

    def __init__(self, type: ChromosomesTypes):
        self._type = type

    @property
    def type(self):
        return self._type
    
    @abstractmethod
    def merge_genes(self, another_chromosome: 'BaseChromosome')  -> List[BaseGene]:
        pass
