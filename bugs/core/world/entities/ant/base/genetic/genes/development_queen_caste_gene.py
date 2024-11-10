from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.domination_codes import DominationCodes
from .development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.ant_types import AntTypes

class DevelopmentQueenCasteGene(DevelopmentCasteGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int) -> 'DevelopmentQueenCasteGene':
        return DevelopmentQueenCasteGene(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    @staticmethod
    def build_new_for_specie_gene():
        return DevelopmentQueenCasteGene.build(DominationCodes.random(), 1.2, 1.5, 1.5, 1, 0.5)

    def __init__(self, domination_code: DominationCodes, strength: int, defense: int, max_hp: int, hp_regen_rate: int, speed: int):
        super().__init__(GenesTypes.DEVELOPMENT_QUEEN_CASTE, domination_code, strength, defense, max_hp, hp_regen_rate, speed, True)

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.QUEEN:
            super().affect(phenotype)