from .nuptial_male import NuptialMale
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.male.male_ant import MaleAnt
from typing import List

class NuptialEnvironment():

    @classmethod
    def build(cls, owner_id: int, base_chromosomes_set: ChromosomesSet):
        return NuptialEnvironment(owner_id, base_chromosomes_set)

    def __init__(self, owner_id: int, base_chromosomes_set: ChromosomesSet):
        self._base_chromosomes_set = base_chromosomes_set
        self._owner_id = owner_id
        self._males: List[NuptialMale] = []

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def base_chromosomes_set(self):
        return self._base_chromosomes_set
    
    def fly_in_male(self, male: MaleAnt):
        pass
    
    def get_male(self, male_id: str) -> NuptialMale:
        for male in self._males:
            if male.id == male_id:
                self._males.remove(male)
                return male
        
        return None
    
    def search_males(self) -> List[NuptialMale]:
        if len(self._males) == 0:
            self._generate_males()

        return self._males
    
    def _generate_males(self, count = 3):
        self._males = []
        for i in range(count):
            male = self._generate_nuptial_male()
            self._males.append(male)
    
    def _generate_nuptial_male(self) -> NuptialMale:
        body_chromosome = self._base_chromosomes_set.body_chromosome.mutate(20, 1, 60)
        development_chromosome = self._base_chromosomes_set.development_chromosome.mutate(20, 1, 50)
        adaptation_chromosome = self._base_chromosomes_set.adaptation_chromosome.mutate(20, 1, 50)
        building_chromosome = self._base_chromosomes_set.building_chromosome.mutate(20, 1, 50)
        combat_chromosome = self._base_chromosomes_set.combat_chromosome.mutate(20, 1, 50)
        adjusting_chromosome = self._base_chromosomes_set.adjusting_chromosome.mutate(20, 1, 50)
        maternal_chromosome_set = ChromosomesSet.build(body_chromosome, development_chromosome, adaptation_chromosome, building_chromosome, combat_chromosome, adjusting_chromosome)
        genome = Genome.build(maternal_chromosome_set, None)
        return NuptialMale.build(genome)
    