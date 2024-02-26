from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from ..genes.body_strength_gene import BodyStrengthGene
from ..genes.body_defense_gene import BodyDefenseGene
from ..genes.body_max_hp_gene import BodyMaxHpGene
from ..genes.body_hp_regen_rate_gene import BodyHpRegenRateGene
from ..genes.body_sight_distance_gene import BodySightDistanceGene
from ..genes.body_speed_gene import BodySpeedGene
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome

class BodyChromosome(BaseChromosome):
    
    @classmethod
    def build(cls, strength_gene: BodyStrengthGene, defense_gene: BodyDefenseGene, max_hp_gene: BodyMaxHpGene, hp_regen_rate_gene: BodyHpRegenRateGene, 
              sight_distance_gene: BodySightDistanceGene, speed_gene: BodySpeedGene):
        return BodyChromosome(strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene)

    def __init__(self, strength_gene: BodyStrengthGene, defense_gene: BodyDefenseGene, max_hp_gene: BodyMaxHpGene, hp_regen_rate_gene: BodyHpRegenRateGene, 
                 sight_distance_gene: BodySightDistanceGene, speed_gene: BodySpeedGene):
        super().__init__(ChromosomesTypes.BODY)
        self._strength_gene = strength_gene
        self._defense_gene = defense_gene
        self._max_hp_gene = max_hp_gene
        self._hp_regen_rate_gene = hp_regen_rate_gene
        self._sight_distance_gene = sight_distance_gene
        self._speed_gene = speed_gene

    @property
    def strength_gene(self) -> BodyStrengthGene:
        return self._strength_gene

    @property
    def defense_gene(self) -> BodyDefenseGene:
        return self._defense_gene

    @property
    def max_hp_gene(self) -> BodyMaxHpGene:
        return self._max_hp_gene

    @property
    def hp_regen_rate_gene(self) -> BodyHpRegenRateGene:
        return self._hp_regen_rate_gene

    @property
    def sight_distance_gene(self) -> BodySightDistanceGene:
        return self._sight_distance_gene

    @property
    def speed_gene(self) -> BodySpeedGene:
        return self._speed_gene
    
    def merge_genes(self, another_chromosome: 'BodyChromosome') -> List[BaseGene]:
        genes = []

        genes.append(self.strength_gene.merge(another_chromosome.strength_gene))
        genes.append(self.defense_gene.merge(another_chromosome.defense_gene))
        genes.append(self.max_hp_gene.merge(another_chromosome.max_hp_gene))
        genes.append(self.hp_regen_rate_gene.merge(another_chromosome.hp_regen_rate_gene))
        genes.append(self.sight_distance_gene.merge(another_chromosome.sight_distance_gene))
        genes.append(self.speed_gene.merge(another_chromosome.speed_gene))

        return genes
    