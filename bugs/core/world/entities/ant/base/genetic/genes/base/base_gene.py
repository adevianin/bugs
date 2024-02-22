from .genes_types import GenesTypes
from abc import ABC, abstractmethod, abstractclassmethod
from ...phenotype import Phenotype
from .domination_codes import DominationCodes

class BaseGene(ABC):

    @abstractclassmethod
    def build(cls, domination_code: DominationCodes):
        pass

    def __init__(self, type: GenesTypes, domination_code: DominationCodes):
        self._type = type
        self._domination_code = domination_code

    @property
    def type(self):
        return self._type
    
    @property
    def domination_code(self):
        return self._domination_code

    @abstractmethod
    def affect(self, phenotype: Phenotype):
        pass

    def merge(self, another_gene: 'BaseGene') -> 'BaseGene':
        res = DominationCodes.check_domination(another_gene.domination_code, self.domination_code)
        if res == 1:
            return another_gene
        elif res == -1:
            return self
        else:
            return None
