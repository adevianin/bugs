from typing import List
from core.world.entities.ant.base.genetic.phenotype import Phenotype
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
        self.strength_gene = strength_gene
        self.defense_gene = defense_gene
        self.max_hp_gene = max_hp_gene
        self.hp_regen_rate_gene = hp_regen_rate_gene
        self.sight_distance_gene = sight_distance_gene
        self.speed_gene = speed_gene

    def merge(self, another_chromosome: 'BodyChromosome') -> 'BodyChromosome':
        strength_gene = self.strength_gene.merge(another_chromosome.strength_gene)
        defense_gene = self.defense_gene.merge(another_chromosome.defense_gene)
        max_hp_gene = self.max_hp_gene.merge(another_chromosome.max_hp_gene)
        hp_regen_rate_gene = self.hp_regen_rate_gene.merge(another_chromosome.hp_regen_rate_gene)
        sight_distance_gene = self.sight_distance_gene.merge(another_chromosome.sight_distance_gene)
        speed_gene = self.speed_gene.merge(another_chromosome.speed_gene)
        return BodyChromosome.build(strength_gene, defense_gene, max_hp_gene, hp_regen_rate_gene, sight_distance_gene, speed_gene)
    
    def affect_phenotype(self, phenotype: Phenotype):
        self.strength_gene.affect(phenotype)
        self.defense_gene.affect(phenotype)
        self.max_hp_gene.affect(phenotype)
        self.hp_regen_rate_gene.affect(phenotype)
        self.sight_distance_gene.affect(phenotype)
        self.speed_gene.affect(phenotype)
    