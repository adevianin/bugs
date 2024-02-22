from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from abc import abstractclassmethod

import math

class DevelopmentCasteGene(BaseGene):

    @abstractclassmethod
    def build(cls, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int):
        pass

    def __init__(self, type: GenesTypes, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int):
        super().__init__(type, domination_code)
        self._strength = strength
        self._defense = defense
        self._max_hp = max_hp
        self._hp_regen_rate = hp_regen_rate
        self._speed = speed

    @property
    def strength(self):
        return self._strength

    @property
    def defense(self):
        return self._defense

    @property
    def max_hp(self):
        return self._max_hp

    @property
    def hp_regen_rate(self):
        return self._hp_regen_rate

    @property
    def speed(self):
        return self._speed

    def affect(self, phenotype: Phenotype):
        phenotype.strength *= self._strength
        phenotype.defense *= self._defense
        phenotype.max_hp *= self._max_hp
        phenotype.hp_regen_rate *= self._hp_regen_rate
        phenotype.speed *= self._speed
    
    def merge(self, another_gene: 'DevelopmentCasteGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        strength = (self.strength + another_gene.strength) / 2
        defense = (self.defense + another_gene.defense) / 2
        max_hp = (self.max_hp + another_gene.max_hp) / 2
        hp_regen_rate = (self.hp_regen_rate + another_gene.hp_regen_rate) / 2
        speed = (self.speed + another_gene.speed) / 2
        return self.build(self.domination_code, strength, defense, max_hp, hp_regen_rate, speed)

        