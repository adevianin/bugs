from enum import StrEnum

class GenesTypes(StrEnum):
    BASE_STRENGTH = 'base_strength'
    BASE_DEFENSE = 'base_defense'
    BASE_MAX_HP = 'base_max_hp'
    BASE_HP_REGEN_RATE = 'base_hp_regen_rate'
    BASE_SPEED = 'base_speed'
    BASE_SIGHT_DISTANCE = 'base_sight_distance'

    DEVELOPMENT_QUEEN_CASTE = 'development_queen_caste'
    DEVELOPMENT_WORKER_CASTE = 'development_worker_caste'
    DEVELOPMENT_WARRIOR_CASTE = 'development_warrior_caste'

    ADJUSTING_APPETITE = 'adjusting_appetite'
    ADJUSTING_DEVELOPMENT_APPETITE = 'adjusting_development_appetite'