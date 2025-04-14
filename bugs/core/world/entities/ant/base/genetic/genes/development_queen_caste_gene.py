from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.domination_codes import DominationCodes
from .development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.settings import BASE_DEVELOPMENT_QUEEN_STRENGTH, BASE_DEVELOPMENT_QUEEN_DEFENSE, BASE_DEVELOPMENT_QUEEN_MAX_HP, BASE_DEVELOPMENT_QUEEN_HP_REGEN_RATE, BASE_DEVELOPMENT_QUEEN_SPEED

class DevelopmentQueenCasteGene(DevelopmentCasteGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float) -> 'DevelopmentQueenCasteGene':
        return DevelopmentQueenCasteGene(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    @staticmethod
    def build_new_for_specie_gene():
        return DevelopmentQueenCasteGene.build(DominationCodes.random(), BASE_DEVELOPMENT_QUEEN_STRENGTH, BASE_DEVELOPMENT_QUEEN_DEFENSE, 
                                               BASE_DEVELOPMENT_QUEEN_MAX_HP, BASE_DEVELOPMENT_QUEEN_HP_REGEN_RATE, BASE_DEVELOPMENT_QUEEN_SPEED)

    def __init__(self, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float):
        super().__init__(GenesTypes.DEVELOPMENT_QUEEN_CASTE, domination_code, strength, defense, max_hp, hp_regen_rate, speed)

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.QUEEN:
            super().affect(phenotype)