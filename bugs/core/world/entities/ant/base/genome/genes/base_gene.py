from .genes_types import GenesTypes
from abc import ABC, abstractmethod, abstractclassmethod
from core.world.entities.base.live_entity.live_stats import LiveStats

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
    def affect_stats(self, stats: LiveStats):
        pass

    

