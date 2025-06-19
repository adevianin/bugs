from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from abc import abstractmethod
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.settings import DEVELOPMENT_MAX_LIFE_SPAN, DEVELOPMENT_MAX_VALUE_COMMON

class DevelopmentCasteGene(BaseGene):

    @classmethod
    @abstractmethod
    def build(cls, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float, life_span: float):
        pass

    def __init__(self, type: GenesTypes, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float, life_span: float):
        super().__init__(type, ChromosomeTypes.DEVELOPMENT, domination_code)
        self._strength = min(strength, DEVELOPMENT_MAX_VALUE_COMMON)
        self._defense = min(defense, DEVELOPMENT_MAX_VALUE_COMMON)
        self._max_hp = min(max_hp, DEVELOPMENT_MAX_VALUE_COMMON)
        self._hp_regen_rate = min(hp_regen_rate, DEVELOPMENT_MAX_VALUE_COMMON)
        self._speed = min(speed, DEVELOPMENT_MAX_VALUE_COMMON)
        self._life_span = min(life_span, DEVELOPMENT_MAX_LIFE_SPAN)

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

    @property
    def life_span(self):
        return self._life_span

    def affect(self, phenotype: Phenotype):
        phenotype.strength *= self._strength
        phenotype.defense *= self._defense
        phenotype.max_hp *= self._max_hp
        phenotype.hp_regen_rate *= self._hp_regen_rate
        phenotype.speed *= self._speed
        phenotype.life_span *= self._life_span
    
    def merge(self, another_gene: 'DevelopmentCasteGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        strength = (self.strength + another_gene.strength) / 2
        defense = (self.defense + another_gene.defense) / 2
        max_hp = (self.max_hp + another_gene.max_hp) / 2
        hp_regen_rate = (self.hp_regen_rate + another_gene.hp_regen_rate) / 2
        speed = (self.speed + another_gene.speed) / 2
        life_span = (self.life_span + another_gene.life_span) / 2
        return self.build(self.domination_code, strength, defense, max_hp, hp_regen_rate, speed, life_span)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        percent = percent / 3
        super_mutate_percent = super_mutate_percent / 3
        strength = self._deviate_value(self.strength, percent, super_mutate_chance, super_mutate_percent)
        defense = self._deviate_value(self.defense, percent, super_mutate_chance, super_mutate_percent)
        max_hp = self._deviate_value(self.max_hp, percent, super_mutate_chance, super_mutate_percent)
        hp_regen_rate = self._deviate_value(self.hp_regen_rate, percent, super_mutate_chance, super_mutate_percent)
        speed = self._deviate_value(self.speed, percent, super_mutate_chance, super_mutate_percent)
        life_span = self._deviate_value(self.life_span, percent, super_mutate_chance, super_mutate_percent)
        return self.build(DominationCodes.random(), strength, defense, max_hp, hp_regen_rate, speed, life_span)
    
    def upgrade(self) -> 'DevelopmentCasteGene':
        strength = self.strength
        defense = self.defense
        max_hp = self.max_hp
        hp_regen_rate = self.hp_regen_rate
        speed = self.speed
        life_span = self.life_span
        return self.build(DominationCodes.random(), strength, defense, max_hp, hp_regen_rate, speed, life_span)

        