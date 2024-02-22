from .chromosome import Chromosome

class ChromosomesSet():

    @classmethod
    def build(cls, base: Chromosome, development: Chromosome, adaptation: Chromosome, building: Chromosome, combat: Chromosome, adjusting: Chromosome):
        return ChromosomesSet(base, development, adaptation, building, combat, adjusting)

    def __init__(self, base: Chromosome, development: Chromosome, adaptation: Chromosome, building: Chromosome, combat: Chromosome, adjusting: Chromosome):
        self._base_chromosome = base
        self._development_chromosome = development
        self._adaptation_chromosome = adaptation
        self._building_chromosome = building
        self._combat_chromosome = combat
        self._adjusting_chromosome = adjusting

    @property
    def base_chromosome(self) -> Chromosome:
        return self._base_chromosome
    
    @property
    def development_chromosome(self) -> Chromosome:
        return self._development_chromosome
    
    @property
    def adaptation_chromosome(self) -> Chromosome:
        return self._adaptation_chromosome
    
    @property
    def building_chromosome(self) -> Chromosome:
        return self._building_chromosome
    
    @property
    def combat_chromosome(self) -> Chromosome:
        return self._combat_chromosome
    
    @property
    def adjusting_chromosome(self) -> Chromosome:
        return self._adjusting_chromosome