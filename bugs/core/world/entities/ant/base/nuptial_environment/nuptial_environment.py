from .nuptial_male import NuptialMale
from core.world.entities.ant.male.male_ant import MaleAnt
from .specie_builder.specie_builder import SpecieBuilder
from typing import List

class NuptialEnvironment():

    @classmethod
    def build(cls, owner_id: int, specie_builder: SpecieBuilder):
        return NuptialEnvironment(owner_id, specie_builder)

    def __init__(self, owner_id: int, specie_builder: SpecieBuilder):
        self._specie_builder = specie_builder
        self._owner_id = owner_id
        self._males: List[NuptialMale] = []
        self._specie_male_genome = self._specie_builder.build_male_genome()

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def specie_builder(self) -> SpecieBuilder:
        return self._specie_builder
    
    # @property
    # def base_chromosomes_set(self):
    #     return self._base_chromosomes_set
    
    def fly_in_male(self, male: MaleAnt):
        genes = male.body.genome.get_genes()
        for gene in genes:
            self._specie_builder.add_new_gene(gene)
    
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
        mutated_genome = self._specie_male_genome.mutate(20, 1, 60)
        return NuptialMale.build(mutated_genome)
    