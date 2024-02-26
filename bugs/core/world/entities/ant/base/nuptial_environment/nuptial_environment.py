from .nuptial_male import NuptialMale
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet

from typing import List

class NuptialEnvironment():

    @classmethod
    def build(cls, owner_id: int, base_chromosomes_set: ChromosomesSet):
        return NuptialEnvironment(owner_id, base_chromosomes_set)

    def __init__(self, owner_id: int, base_chromosomes_set: ChromosomesSet):
        self._base_chromosomes_set = base_chromosomes_set
        self._owner_id = owner_id
        self._males = []

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def base_chromosomes_set(self):
        return self._base_chromosomes_set
    
    def get_male(self, male_id: str) -> NuptialMale:
        for male in self._males:
            if male.id == male_id:
                return male
        
        return None
    
    def search_males(self) -> List[NuptialMale]:
        male1 = NuptialMale.build(self._base_genes)
        male2 = NuptialMale.build(self._base_genes)
        male3 = NuptialMale.build(self._base_genes)

        self._males = [male1, male2, male3]

        return self._males
    