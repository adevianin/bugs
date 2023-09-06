from enum import StrEnum

class ThoughtTypes(StrEnum):
    GO_IN_NEST = 'go_in_nest'
    WALK_TO = 'walk_to'
    RANDOM_WALK = 'random_walk'
    FIND_FOOD = 'find_food'
    COLLECT_FOOD = 'collect_food'
    FEED_MYSELF = 'feed_myself'
    PREPARE_FOR_OPERATION = 'prepare_for_operation'
    FOUND_NEST = 'found_nest'
    BUILD_NEST = 'build_nest'
    DEFEND_TERRITORY = 'defend_territory'
    ATTACK_NEST = 'attack_nest'
    FIGHT_ENEMY = 'fight_enemy'
    FIGHT_NEAR_ENEMIES = 'fight_near_enemies'
    REINFORCE_NEST_DEFENCE = 'reinforce_nest_defence'
    HUNT_FOR_APHID = 'hunt_for_aphid'
    WALK_IN_FORMATION = 'walk_in_formation'