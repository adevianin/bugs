from .chromosome import Chromosome

class ChromosomesSet():

    @classmethod
    def build(cls, base_chromosome: Chromosome, development_chromosome: Chromosome, adaptation_chromosome: Chromosome, building_chromosome: Chromosome, combat_chromosome: Chromosome):
        return ChromosomesSet(base_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome)

    def __init__(self, base_chromosome: Chromosome, development_chromosome: Chromosome, adaptation_chromosome: Chromosome, building_chromosome: Chromosome, combat_chromosome: Chromosome):
        self._base_chromosome = base_chromosome
        self._development_chromosome = development_chromosome
        self._adaptation_chromosome = adaptation_chromosome
        self._building_chromosome = building_chromosome
        self._combat_chromosome = combat_chromosome

    @property
    def base_chromosome(self):
        return self._base_chromosome
    
    @property
    def development_chromosome(self):
        return self._development_chromosome
    
    @property
    def adaptation_chromosome(self):
        return self._adaptation_chromosome
    
    @property
    def building_chromosome(self):
        return self._building_chromosome
    
    @property
    def combat_chromosome(self):
        return self._combat_chromosome