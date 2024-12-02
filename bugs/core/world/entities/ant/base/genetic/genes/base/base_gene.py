from .genes_types import GenesTypes
from abc import ABC, abstractmethod, abstractclassmethod
from ...phenotype import Phenotype
from .domination_codes import DominationCodes
from core.world.utils.probability_check import probability_check
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
import random

class BaseGene(ABC):

    @abstractclassmethod
    def build(cls, domination_code: DominationCodes):
        pass

    @staticmethod
    @abstractmethod
    def build_new_for_specie_gene():
        pass

    def __init__(self, type: GenesTypes, chromosome_type: ChromosomeTypes, domination_code: DominationCodes):
        self._type = type
        self._chromosome_type = chromosome_type
        self._domination_code = domination_code

    @property
    def type(self):
        return self._type

    @property
    def chromosome_type(self):
        return self._chromosome_type
    
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
        
    @abstractmethod
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'BaseGene':
        pass

    @abstractmethod
    def upgrade(self) -> 'BaseGene':
        pass

    def _deviate_value(self, value, percent, super_deviation_chance, super_deviation_percent):
        is_super_deviation = probability_check(super_deviation_chance)
        if is_super_deviation:
            percent = super_deviation_percent

        min_value = value * (100 - percent) / 100
        max_value = value * (100 + percent) / 100
        return random.uniform(min_value, max_value)
