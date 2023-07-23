from enum import StrEnum

class ThoughtTypes(StrEnum):
    GO_IN_NEST = 'go_in_nest'
    WALK_TO = 'walk_to'
    SEARCHING_WALK = 'searching_walk'
    FIND_FOOD = 'find_food'
    COLLECT_FOOD = 'collect_food'
    FEED_MYSELF = 'feed_myself'
    PREPARE_FOR_OPERATION = 'prepare_for_operation'
    FOUND_NEST = 'found_nest'
    BUILD_NEST = 'build_nest'
    PATROLLING_TERRITORY = 'patrolling_territory'
    ATTACK_NEST = 'attack_nest'