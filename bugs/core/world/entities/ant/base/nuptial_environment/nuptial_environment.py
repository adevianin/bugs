from core.world.entities.ant.base.genes import Genes
from .nuptial_male import NuptialMale

from typing import List

class NuptialEnvironment():

    @classmethod
    def build(cls, owner_id: int, base_genes: Genes):
        return NuptialEnvironment(owner_id, base_genes)

    def __init__(self, owner_id: int, base_genes: Genes):
        self._base_genes = base_genes
        self._owner_id = owner_id

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def base_genes(self):
        return self._base_genes
    
    def absorb_genes(self, genes: Genes):
        pass
    
    def search_males(self) -> List[NuptialMale]:
        male1 = NuptialMale.build(self._base_genes)
        male2 = NuptialMale.build(self._base_genes)
        male3 = NuptialMale.build(self._base_genes)

        return [male1, male2, male3]
    
    