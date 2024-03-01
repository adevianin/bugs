from abc import ABC, abstractmethod
from typing import List, Dict
from .chromosomes_types import ChromosomesTypes
from core.world.entities.ant.base.genetic.phenotype import Phenotype

class BaseChromosome(ABC):

    def __init__(self, type: ChromosomesTypes):
        self._type = type

    @property
    def type(self):
        return self._type
    
    @abstractmethod
    def merge(self, another_chromosome: 'BaseChromosome') -> 'BaseChromosome':
        pass

    @abstractmethod
    def affect_phenotype(self, phenotype: Phenotype):
        pass
