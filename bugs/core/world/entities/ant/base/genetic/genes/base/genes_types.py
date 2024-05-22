from enum import StrEnum

class GenesTypes(StrEnum):
    BODY_STRENGTH = 'body_strength'
    BODY_DEFENSE = 'body_defense'
    BODY_MAX_HP = 'body_max_hp'
    BODY_HP_REGEN_RATE = 'body_hp_regen_rate'
    BODY_SPEED = 'body_speed'
    BODY_SIGHT_DISTANCE = 'body_sight_distance'

    DEVELOPMENT_QUEEN_CASTE = 'development_queen_caste'
    DEVELOPMENT_WORKER_CASTE = 'development_worker_caste'
    DEVELOPMENT_WARRIOR_CASTE = 'development_warrior_caste'
    DEVELOPMENT_MALE_CASTE = 'development_male_caste'

    ADJUSTING_APPETITE = 'adjusting_appetite'
    ADJUSTING_DEVELOPMENT_APPETITE = 'adjusting_development_appetite'

    ADAPTATION_COLD = 'adaptation_cold'