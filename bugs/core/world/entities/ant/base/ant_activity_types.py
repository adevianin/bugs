from enum import StrEnum

class AntActivityTypes(StrEnum):
    PREPARING_FOR_HIBERNATION = 'preparing_for_hibernation'
    HIBERNATION = 'hibernation'
    PATROLING_NEST_TERRITORY = 'patroling_nest_territory'
    COLLECTING_FOOD = 'collecting_food'
    FEEDING_MYSELF = 'feeding_myself'
    DEFENDING_HOME_NEST = 'defending_home_nest'
    DEFENDING_MYSELF = 'defending_myself'
    DEFENDING_COLONY = 'defending_colony'
    SHELTERING_IN_NEST = 'sheltering_in_nest'
    IN_OPERATION = 'in_operation'
    GO_HOME = 'go_home'
    WATCHING_NEST = 'watching_nest'
    FOUNDING_MAIN_NEST = 'founding_main_nest'
