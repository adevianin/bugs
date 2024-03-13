from .specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet

class SpecieChromosomeSet():

    @classmethod
    def build(self, body: SpecieChromosome, development: SpecieChromosome, adaptation: SpecieChromosome, building: SpecieChromosome, combat: SpecieChromosome, 
                 adjusting: SpecieChromosome):
        return SpecieChromosomeSet(body, development, adaptation, building, combat, adjusting)

    def __init__(self, body: SpecieChromosome, development: SpecieChromosome, adaptation: SpecieChromosome, building: SpecieChromosome, combat: SpecieChromosome, 
                 adjusting: SpecieChromosome):
        self._body = body
        self._development = development
        self._adaptation = adaptation
        self._building = building
        self._combat = combat
        self._adjusting = adjusting

    @property
    def body_specie_chromosome(self) -> SpecieChromosome:
        return self._body

    @property
    def development_specie_chromosome(self) -> SpecieChromosome:
        return self._development

    @property
    def adaptation_specie_chromosome(self) -> SpecieChromosome:
        return self._adaptation

    @property
    def building_specie_chromosome(self) -> SpecieChromosome:
        return self._building

    @property
    def combat_specie_chromosome(self) -> SpecieChromosome:
        return self._combat

    @property
    def adjusting_specie_chromosome(self) -> SpecieChromosome:
        return self._adjusting
    
    def accept_chromosome_set(self, chromosome_set: ChromosomesSet):
        self._body.accept_chromosome(chromosome_set.body_chromosome)
        self._development.accept_chromosome(chromosome_set.development_chromosome)
        self._adaptation.accept_chromosome(chromosome_set.adaptation_chromosome)
        self._building.accept_chromosome(chromosome_set.building_chromosome)
        self._combat.accept_chromosome(chromosome_set.combat_chromosome)
        self._adjusting.accept_chromosome(chromosome_set.adjusting_chromosome)
    
    def generate_chorosome_set(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> ChromosomesSet:
        body = self._body.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        development = self._development.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        adaptation = self._adaptation.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        building = self._building.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        combat = self._combat.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        adjusting = self._adjusting.generate_chromosome(percent, super_mutate_chance, super_mutate_percent)
        return ChromosomesSet.build(body, development, adaptation, building, combat, adjusting)