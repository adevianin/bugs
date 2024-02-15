from .genes_types import GenesTypes
from abc import ABC, abstractmethod, abstractclassmethod
from ..phenotype import Phenotype

class BaseGene(ABC):

    @abstractclassmethod
    def build(cls, domination_lvl: int):
        pass

    def __init__(self, type: GenesTypes, domination_lvl: int):
        self._type = type
        self._domination_lvl = domination_lvl

    @property
    def type(self):
        return self._type
    
    @property
    def domination_lvl(self):
        return self._domination_lvl

    @abstractmethod
    def affect(self, phenotype: Phenotype):
        pass

    def merge(self, another_gene: 'BaseGene') -> 'BaseGene':
        if another_gene.domination_lvl > self.domination_lvl:
            return another_gene
        elif self.domination_lvl > another_gene.domination_lvl:
            return self
        else:
            return None
