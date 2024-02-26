from .body_chromosome import BodyChromosome
from .development_chromosome import DevelopmentChromosome
from .adaptation_chromosome import AdaptationChromosome
from .building_chromosome import BuildingChromosome
from .combat_chromosome import CombatChromosome
from .adjusting_chromosome import AdjustingChromosome

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