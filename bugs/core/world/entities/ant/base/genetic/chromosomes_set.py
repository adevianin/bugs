from .chromosomes.body_chromosome import BodyChromosome
from .chromosomes.development_chromosome import DevelopmentChromosome
from .chromosomes.adaptation_chromosome import AdaptationChromosome
from .chromosomes.building_chromosome import BuildingChromosome
from .chromosomes.combat_chromosome import CombatChromosome
from .chromosomes.adjusting_chromosome import AdjustingChromosome
from .phenotype import Phenotype

class ChromosomesSet():

    @classmethod
    def build(cls, body: BodyChromosome, development: DevelopmentChromosome, adaptation: AdaptationChromosome, building: BuildingChromosome, combat: CombatChromosome, 
              adjusting: AdjustingChromosome):
        return ChromosomesSet(body, development, adaptation, building, combat, adjusting)

    def __init__(self, body: BodyChromosome, development: DevelopmentChromosome, adaptation: AdaptationChromosome, building: BuildingChromosome, combat: CombatChromosome, 
                 adjusting: AdjustingChromosome):
        self._body_chromosome = body
        self._development_chromosome = development
        self._adaptation_chromosome = adaptation
        self._building_chromosome = building
        self._combat_chromosome = combat
        self._adjusting_chromosome = adjusting

    @property
    def body_chromosome(self) -> BodyChromosome:
        return self._body_chromosome
    
    @property
    def development_chromosome(self) -> DevelopmentChromosome:
        return self._development_chromosome
    
    @property
    def adaptation_chromosome(self) -> AdaptationChromosome:
        return self._adaptation_chromosome
    
    @property
    def building_chromosome(self) -> BuildingChromosome:
        return self._building_chromosome
    
    @property
    def combat_chromosome(self) -> CombatChromosome:
        return self._combat_chromosome
    
    @property
    def adjusting_chromosome(self) -> AdjustingChromosome:
        return self._adjusting_chromosome
    
    def merge(self, another_chromosome_set: 'ChromosomesSet'):
        body_chromosome = self._body_chromosome.merge(another_chromosome_set.body_chromosome)
        development_chromosome = self._development_chromosome.merge(another_chromosome_set.development_chromosome)
        adaptation_chromosome = self._adaptation_chromosome.merge(another_chromosome_set.adaptation_chromosome)
        building_chromosome = self._building_chromosome.merge(another_chromosome_set.building_chromosome)
        combat_chromosome = self._combat_chromosome.merge(another_chromosome_set.combat_chromosome)
        adjusting_chromosome = self._adjusting_chromosome.merge(another_chromosome_set.adjusting_chromosome)
        return ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
    
    def affect_phenotype(self, phenotype: Phenotype):
        self._body_chromosome.affect_phenotype(phenotype)
        self._development_chromosome.affect_phenotype(phenotype)
        self._adaptation_chromosome.affect_phenotype(phenotype)
        self._building_chromosome.affect_phenotype(phenotype)
        self._combat_chromosome.affect_phenotype(phenotype)
        self._adjusting_chromosome.affect_phenotype(phenotype)