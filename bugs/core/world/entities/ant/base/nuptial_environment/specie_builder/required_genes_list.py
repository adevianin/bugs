from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes

REQUIRED_GENES = {
    ChromosomeTypes.BODY: [GenesTypes.BODY_STRENGTH, GenesTypes.BODY_DEFENSE, GenesTypes.BODY_HP_REGEN_RATE, GenesTypes.BODY_MAX_HP, GenesTypes.BODY_SIGHT_DISTANCE, GenesTypes.BODY_SPEED, GenesTypes.BODY_LIFE_SPAN],
    ChromosomeTypes.DEVELOPMENT: [GenesTypes.DEVELOPMENT_QUEEN_CASTE, GenesTypes.DEVELOPMENT_MALE_CASTE, GenesTypes.DEVELOPMENT_WORKER_CASTE],
    ChromosomeTypes.ADAPTATION: [GenesTypes.ADAPTATION_APPETITE, GenesTypes.ADAPTATION_DEVELOPMENT_APPETITE],
    ChromosomeTypes.SPECIALIZATION: []
}