from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.domination_codes import DominationCodes
from .development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.ant_types import AntTypes

class DevelopmentMaleCasteGene(DevelopmentCasteGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int) -> 'DevelopmentMaleCasteGene':
        return DevelopmentMaleCasteGene(domination_code, strength, defense, max_hp, hp_regen_rate, speed)

    def __init__(self, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int):
        super().__init__(GenesTypes.DEVELOPMENT_WORKER_CASTE, domination_code, strength, defense, max_hp, hp_regen_rate, speed)

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.MALE:
            super().affect(phenotype)