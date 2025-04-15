from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.domination_codes import DominationCodes
from .development_caste_gene import DevelopmentCasteGene
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.settings import (BASE_DEVELOPMENT_WORKER_STRENGTH, BASE_DEVELOPMENT_WORKER_DEFENSE, BASE_DEVELOPMENT_WORKER_MAX_HP, BASE_DEVELOPMENT_WORKER_HP_REGEN_RATE, 
                                 BASE_DEVELOPMENT_WORKER_SPEED, BASE_DEVELOPMENT_WORKER_LIFE_SPAN)

class DevelopmentWorkerCasteGene(DevelopmentCasteGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float, life_span: float) -> 'DevelopmentWorkerCasteGene':
        return DevelopmentWorkerCasteGene(domination_code, strength, defense, max_hp, hp_regen_rate, speed, life_span)
    
    @staticmethod
    def build_new_for_specie_gene():
        return DevelopmentWorkerCasteGene.build(DominationCodes.random(), BASE_DEVELOPMENT_WORKER_STRENGTH, BASE_DEVELOPMENT_WORKER_DEFENSE, 
                                                BASE_DEVELOPMENT_WORKER_MAX_HP, BASE_DEVELOPMENT_WORKER_HP_REGEN_RATE, BASE_DEVELOPMENT_WORKER_SPEED, BASE_DEVELOPMENT_WORKER_LIFE_SPAN)

    def __init__(self, domination_code: DominationCodes, strength: float, defense: float, max_hp: float, hp_regen_rate: float, speed: float, life_span: float):
        super().__init__(GenesTypes.DEVELOPMENT_WORKER_CASTE, domination_code, strength, defense, max_hp, hp_regen_rate, speed, life_span)

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.WORKER:
            super().affect(phenotype)