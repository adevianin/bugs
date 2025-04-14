from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.domination_codes import DominationCodes
from .development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.settings import BASE_DEVELOPMENT_MALE_STRENGTH, BASE_DEVELOPMENT_MALE_DEFENSE, BASE_DEVELOPMENT_MALE_MAX_HP, BASE_DEVELOPMENT_MALE_HP_REGEN_RATE, BASE_DEVELOPMENT_MALE_SPEED

class DevelopmentMaleCasteGene(DevelopmentCasteGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float) -> 'DevelopmentMaleCasteGene':
        return DevelopmentMaleCasteGene(domination_code, strength, defense, max_hp, hp_regen_rate, speed)
    
    @staticmethod
    def build_new_for_specie_gene():
        return DevelopmentMaleCasteGene.build(DominationCodes.random(), BASE_DEVELOPMENT_MALE_STRENGTH, BASE_DEVELOPMENT_MALE_DEFENSE, BASE_DEVELOPMENT_MALE_MAX_HP, 
                                              BASE_DEVELOPMENT_MALE_HP_REGEN_RATE, BASE_DEVELOPMENT_MALE_SPEED)

    def __init__(self, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float):
        super().__init__(GenesTypes.DEVELOPMENT_MALE_CASTE, domination_code, strength, defense, max_hp, hp_regen_rate, speed)

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.MALE:
            super().affect(phenotype)