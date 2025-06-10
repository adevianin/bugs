import { GAME_MESSAGE_IDS } from "../messageIds";
import { COMMON_EN_LIBRARY } from "@common/messages/msgLibraries/enLibrary";

const EN_LIBRARY = {
    ...COMMON_EN_LIBRARY,
    [GAME_MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Old password is not specified.',

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'The female needs a location to settle down.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'The location for settling down is already occupied.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'A female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'A living female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'A male from distant regions is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_FEMALE]: 'Choose female:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_MALE]: 'Choose male:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEW_COLONY_NAME]: 'Name of the new colony:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEST_POSITION]: 'Nest placement:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_CHOOSE_NEST_POSITION]: 'Choose',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_START]: 'Breed',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_FULL]: '{0} hr. {1} min. {2} sec.',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_SHORT]: '{0} min. {1} sec.',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NAME]: 'Breeding',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER]: 'The breeding season will begin in ',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NO_QUEENS]: 'There are no females in the nuptial flight.',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_BORN_ANTARA]: 'Birth the Antara Female',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NO_MALES]: 'There are no males from distant lands in the nuptial flight.',

    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN]: 'You can\'t build a satellite nest in a colony without a queen.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED]: 'Ants need a location chosen for building a nest.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED]: 'The position for building a nest is already occupied.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS]: 'The maximum number of satellite nests has been reached.',

    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN]: 'Without a queen, ants cannot attack other nests.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NEST_NEEDED]: 'Ants need a nest to be specified for the attack.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED]: 'Ants need an intact nest to be specified for the attack.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_TOO_FEW_ANTS]: 'Too few ants to attack.',

    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN]: 'Without a queen, ants cannot pillage other nests.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED]: 'Ants need a nest to be specified for raiding.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED]: 'Ants need an intact nest to be specified for raiding.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_FOR_LOOT_NEEDED]: 'Ants need a nest to be specified for loot.',

    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_FROM_NEEDED]: 'Ants need a nest to be specified from which to transport food.',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_TO_NEEDED]: 'Ants need a nest to be specified into which to transport food.',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_DIFFERENT_NESTS_NEEDED]: 'Ants can transport food only between different nests within their colony.',

    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OPER_NEST_NEEDED]: 'Ants need a nest to be specified for constructing protection for their colony.',

    [GAME_MESSAGE_IDS.BRING_BUG_OPER_NEST_NEEDED]: 'Ants need a nest to be specified where a delicious beetle\'s corpse was spotted.',
    [GAME_MESSAGE_IDS.BRING_BUG_OPER_NO_BUG_FOUND]: 'The beetle near the specified nest has not been found.',

    [GAME_MESSAGE_IDS.NEST_INLINE_NOT_SPECIFIED]: 'not specified',
    [GAME_MESSAGE_IDS.NEST_INLINE_DESTROYED]: 'destroyed',

    [GAME_MESSAGE_IDS.NEST_SELECTOR_NOT_SELECTED]: 'not selected',

    [GAME_MESSAGE_IDS.INT_INPUT_MIN_MAX]: '(min. {0}, max. {1})',
    [GAME_MESSAGE_IDS.INT_INPUT_MIN]: '(min. {0})',
    [GAME_MESSAGE_IDS.INT_INPUT_MAX]: '(max. {0})',

    [GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH]: 'Minimum length {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH]: 'Maximum length {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR]: 'Letters and numbers only.',

    [GAME_MESSAGE_IDS.POSITION_NOT_SPECIFIED]: 'not specified',

    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_PLACE]: 'Death place.',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_PLACE]: 'Place of Destruction.',

    [GAME_MESSAGE_IDS.CLIMATE_LABEL_YEAR]: 'year',
    [GAME_MESSAGE_IDS.SEASON_LABEL_SPRING]: 'spring',
    [GAME_MESSAGE_IDS.SEASON_LABEL_SUMMER]: 'summer',
    [GAME_MESSAGE_IDS.SEASON_LABEL_AUTUMN]: 'autumn',
    [GAME_MESSAGE_IDS.SEASON_LABEL_WINTER]: 'winter',

    [GAME_MESSAGE_IDS.STATS_LABEL_MAX_HP]: 'maximum HP',
    [GAME_MESSAGE_IDS.STATS_LABEL_HP_REGEN_RATE]: 'HP regeneration speed',
    [GAME_MESSAGE_IDS.STATS_LABEL_SPEED]: 'moving speed',
    [GAME_MESSAGE_IDS.STATS_LABEL_SIGHT_DISTANCE]: 'sight distance',
    [GAME_MESSAGE_IDS.STATS_LABEL_STRENGTH]: 'strength',
    [GAME_MESSAGE_IDS.STATS_LABEL_DEFENSE]: 'defense',
    [GAME_MESSAGE_IDS.STATS_LABEL_APPETITE]: 'appetite',
    [GAME_MESSAGE_IDS.STATS_LABEL_MIN_TEMP]: 'minimal temperature',
    [GAME_MESSAGE_IDS.STATS_LABEL_LIFE_SPAN]: 'life span',

    [GAME_MESSAGE_IDS.GENOME_LABEL_ANALIZE_GENOME]: 'analyze genome',
    [GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE]: 'domination code:',
    [GAME_MESSAGE_IDS.GENE_LABEL_VALUE]: 'value:',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_STRENGTH]: 'strength gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_DEFENSE]: 'defense gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_MAX_HP]: 'max HP gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_HP_REGEN_RATE]: 'HP regeneration gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_SIGHT_DISTANCE]: 'sight distance gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_SPEED]: 'moving speed gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_LIFE_SPAN]: 'life span gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST]: 'building satellite nests gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_APPETITE]: 'appetite gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE]: 'development appetite gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_COLD]: 'cold adaptation gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WORKER_CASTE]: 'development worker caste gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WARRIOR_CASTE]: 'development warrior caste gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_QUEEN_CASTE]: 'development female caste gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MALE_CASTE]: 'development male caste gene',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_STRENGTH]: 'strength',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_DEFENSE]: 'defense',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MAX_HP]: 'max HP',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE]: 'HP regeneration',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_SPEED]: 'moving speed',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_LIFE_SPAN]: 'life span',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_BODY]: 'body chromosome',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_DEVELOPMENT]: 'development chromosome',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_ADAPTATION]: 'adaptation chromosome',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION]: 'ability chromosome',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_MATERNAL]: 'maternal set of chromosomes',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_PATERNAL]: 'paternal set of chromosomes',

    [GAME_MESSAGE_IDS.COLONIES_TAB_TITLE]: 'Colonies',
    [GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_NO_COLONIES]: 'There are no colonies.',
    [GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_COLONY_SELECTOR]: 'Colony:',
    [GAME_MESSAGE_IDS.COLONIES_TAB_SHOW_COLONY_BTN]: 'show',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ANTS]: 'ants',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_OPERATIONS]: 'pheromones',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_NESTS]: 'nests',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ENEMIES]: 'enemies',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_NAME]: 'name',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_TYPE]: 'type',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_NEST]: 'nest',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_MORE]: 'more',
    [GAME_MESSAGE_IDS.ANTS_LIST_LABEL_NO_ANTS]: 'no ants',

    [GAME_MESSAGE_IDS.ANT_TYPE_QUEEN]: 'Queen',
    [GAME_MESSAGE_IDS.ANT_TYPE_FEMALE]: 'Female',
    [GAME_MESSAGE_IDS.ANT_TYPE_MALE]: 'Male',
    [GAME_MESSAGE_IDS.ANT_TYPE_WORKER]: 'Worker',
    [GAME_MESSAGE_IDS.ANT_TYPE_WARRIOR]: 'Warrior',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_LABEL]: 'guardian behavior',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NONE]: 'does not protect',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NEST]: 'only nest',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_COLONY]: 'entire colony',
    [GAME_MESSAGE_IDS.ANT_COOPERATIVE_BEHAVIOR_LABEL]: 'responds to pheromones',
    [GAME_MESSAGE_IDS.ANT_NUPTIAL_MALE_GENOME_LABEL]: 'genome from the nuptial male',
    [GAME_MESSAGE_IDS.ANT_GENOME_LABEL]: 'ant genome',
    [GAME_MESSAGE_IDS.ANT_AGE_LABEL]: 'age',
    [GAME_MESSAGE_IDS.ANT_CURRENT_ACTIVITY_LABEL]: 'activity',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_NOTHING]: 'doing nothing',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_PREPARING_FOR_HIBERNATION]: 'getting ready for hibernation',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_HIBERNATION]: 'hibernation',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_PATROLING_NEST_TERRITORY]: 'patrolling the nest area',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_COLLECTING_FOOD]: 'collecting food',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_FEEDING_MYSELF]: 'going to eat',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_HOME_NEST]: 'defending the nest',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_MYSELF]: 'defending myself',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_COLONY]: 'defending the colony',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_SHELTERING_IN_NEST]: 'sheltering in the nest',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_IN_OPERATION]: 'following pheromones',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_GOING_HOME]: 'going home',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_WATCHING_NEST]: 'watching the nest',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_BUILDING_MAIN_NEST]: 'building the main nest of the colony',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_LABEL]: 'hunger',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_HUNGRY]: 'hungry',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_NOT_HUNGRY]: 'full',
    [GAME_MESSAGE_IDS.ANT_NUPTIAL_FLIGHT_BTN_LABEL]: 'nuptial flight',
    [GAME_MESSAGE_IDS.ANT_SHOW_BTN_LABEL]: 'show',
    [GAME_MESSAGE_IDS.ANT_NAME_ADJECTIVES]: [
        "Swift",
        "Shadowy",
        "Clever",
        "Hardy",
        "Quick",
        "Dusky",
        "Blazing",
        "Sharp",
        "Silent",
        "Ancient",
        "Sneaky",
        "Dry",
        "Fiery",
        "Tiny",
        "Iron",
        "Vigilant",
        "Wise",
        "Feral",
        "Strong",
        "Tricky",
        "Stone",
        "Bold",
        "Agile",
        "Glimmering",
        "Tough",
        "Wild",
        "Dark",
        "Clawed",
        "Fearless",
        "Forest"
    ],
    [GAME_MESSAGE_IDS.ANT_NAME_NOUNS]: [
        "Seeker",
        "Builder",
        "Tracker",
        "Worker",
        "Defender",
        "Scout",
        "Devourer",
        "Catcher",
        "Fighter",
        "Predator",
        "Wanderer",
        "Drifter",
        "Guardian",
        "Gatherer",
        "Digger",
        "Watcher",
        "Weaver",
        "Stalker",
        "Reaper",
        "Hunter",
        "Rebel",
        "Mute",
        "Outrider",
        "Constructor",
        "Pathfinder",
        "Flamewalker",
        "Observer",
        "Burrower",
        "Besieger",
        "Sentinel"
    ],

    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_NAME]: 'name',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_STATUS]: 'status',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_HIRING]: 'engaged ants',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_ACTIONS]: 'actions',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_NO_OPERATIONS_LABEL]: 'No active pheromone signals.',

    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_TITLE]: 'Pheromone signals:',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_NEW_SUB_NEST_BTN_LABEL]: 'build sub nest',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_DESTROY_NEST_BTN_LABEL]: 'destroy a nest',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_PILLAGE_NEST_BTN_LABEL]: 'pillage a nest',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_TRANSPORT_FOOD_BTN_LABEL]: 'transport food',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_BUILD_FORTIFICATIONS_BTN_LABEL]: 'build nest defenses',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_BRING_BUG_CORPSE_BTN_LABEL]: 'bring bug',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_CANCEL_OPERATION_CREATING_BTN_LABEL]: 'back',

    [GAME_MESSAGE_IDS.OPERATION_CREATOR_WORKERS_COUNT]: 'workers count:',
    [GAME_MESSAGE_IDS.OPERATION_CREATOR_WARRIORS_COUNT]: 'warriors count:',
    [GAME_MESSAGE_IDS.OPERATION_CREATOR_START_BTN_LABEL]: 'deploy pheromone signal',

    [GAME_MESSAGE_IDS.OPERATION_STATUS_IN_PROGRESS_LABEL]: 'in progress',
    [GAME_MESSAGE_IDS.OPERATION_STATUS_HIRING_LABEL]: 'ant gathering',
    [GAME_MESSAGE_IDS.OPERATION_STATUS_DONE_LABEL]: 'done',
    [GAME_MESSAGE_IDS.OPERATION_ACTIVATE_BTN_LABEL]: 'show',
    [GAME_MESSAGE_IDS.OPERATION_STOP_BTN_LABEL]: 'stop',
    [GAME_MESSAGE_IDS.OPERATION_DEACTIVATE_BTN_LABEL]: 'hide',
    [GAME_MESSAGE_IDS.OPERATION_HIRING_WORKERS_STATUS_LABEL]: 'workers',
    [GAME_MESSAGE_IDS.OPERATION_HIRING_WARRIORS_STATUS_LABEL]: 'warriors',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_NEW_SUBNEST]: 'building a satellite nest',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_DESTROY_NEST]: 'attacking enemy nest',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_PILLAGE_NEST]: 'pillaging enemy nest',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_TRANSPORT_FOOD]: 'transporting food',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BUILD_FORTIFICATION]: 'building defenses',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BRING_BUG]: 'bringing bug to nest',
    
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_TITLE]: 'Building satellite nest',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL]: 'nest position:',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_CHOOSE_NEST_POSITION_BTN_LABEL]: 'choose',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_WORKER_REQUIREMENTS_LABEL]: '*Worker ants must have the gene for building satellite nests',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_NEST_NAME_LABEL]: 'nest name:',

    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_TITLE]: 'Destroy nest',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_NEST_TO_DESTROY_LABEL]: 'nest:',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_CHOOSE_NEST_BTN_LABEL]: 'choose',

    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_TITLE]: 'Pillage nest',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_TO_PILLAGE_LABEL]: 'nest to pillage:',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_CHOOSE_NEST_TO_PILLAGE_BTN_LABEL]: 'choose',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_FOR_LOOT_LABEL]: 'nest for loot:',

    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_TITLE]: 'Transport food',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_FROM_NEST_LABEL]: 'from nest:',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_TO_NEST_LABEL]: 'to nest:',

    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OP_CR_TITLE]: 'Build nest defenses',
    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OP_CR_NEST_LABEL]: 'nest:',

    [GAME_MESSAGE_IDS.BRING_BUG_OP_CR_TITLE]: 'Bring bug',
    [GAME_MESSAGE_IDS.BRING_BUG_OP_CR_NEST_LABEL]: 'nest:',

    [GAME_MESSAGE_IDS.NESTS_TAB_NEST_LABEL]: 'nest:',
    [GAME_MESSAGE_IDS.NESTS_TAB_SHOW_NEST_BTN]: 'show',

    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_NAME_LABEL]: 'name:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_FOOD_COUNT_LABEL]: 'food amount:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_IS_NEST_MAIN_LABEL]: 'is main nest:',

    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_TITLE]: 'Egg chamber',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_FERTILIZE_LABEL]: 'fertilize',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_BTN_LABEL]: 'lay egg',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_NAME]: 'name',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_STATE]: 'state',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_CASTE]: 'caste',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_ACTIONS]: 'actions',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_TITLE]: 'Egg laying:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NO_EGGS_LABEL]: 'There are no eggs.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_EGG_TO_LARVA_BTN_LABEL]: 'to larvae',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_DELETE_EGG_BTN_LABEL]: 'discard',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST]: 'The queen is not in the nest to lay eggs.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG]: 'There isn\'t enough food in the nest for the queen to lay eggs.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_SUITABLE_SEASON_TO_LAY_EGG]: 'This season isn\'t suitable for the queen to lay eggs.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_TITLE]: 'Larva chamber',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_NAME]: 'name',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_PROGRESS]: 'progress',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_CASTE]: 'caste',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_ACTIONS]: 'actions',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_REMOVE_LARVA_BTN_LABEL]: 'discard',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_NO_LARVA_LABEL]: 'There are no larvae.',

    [GAME_MESSAGE_IDS.EGG_STATE_DEVELOPMENT]: 'developing',
    [GAME_MESSAGE_IDS.EGG_STATE_READY]: 'ready',
    [GAME_MESSAGE_IDS.EGG_STATE_SPOILED]: 'spoiled',

    [GAME_MESSAGE_IDS.ENEMIES_TAB_NO_ENEMY_LABEL]: 'The colony has no enemies.',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_SHOW_ENEMY_BTN_LABEL]: 'show',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_TABLE_COL_COLONY_NAME]: 'name of enemy colony',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_TABLE_COL_ACTIONS]: 'actions',

    [GAME_MESSAGE_IDS.SPECIE_BUILDER_TAB_TITLE]: 'Specie builder',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_BODY]: 'body',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_DEVELOPMENT]: 'caste',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_ADAPTATION]: 'adaptation',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_SPECIALIZATION]: 'ability',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_ACTIVATED_GENES_TITLE]: 'Fixed Genes:',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_NOT_ACTIVATED_GENES_TITLE]: 'Candidate Genes:',

    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_TITLE]: 'Notifications',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_COL_TITLE_EVENT]: 'Event',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_COL_TITLE_YEAR]: 'When',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_SHOW_MORE_BTN_LABEL]: 'Earlier',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_NO_NOTIFICATIONS_LABEL]: 'No notifications',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_ANT]: 'Ant',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_NEST]: 'Nest',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_COLONY]: 'Colony',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_COMBAT]: 'died in battle',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_FREEZED]: 'froze to death',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_AGED]: 'died of old age',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_HUNGER]: 'died of hunger',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_WITHOUT_HOME]: 'died without home',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_NUPTIAL_FLIGHT]: 'died in nuptial flight',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_UNKNOWN]: 'died of unknown causes',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_BURIED_IN_NEST]: 'died in a destroyed nest',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_COMBAT]: 'destroyed',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_DECAY]: 'decayed',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_UNKNOWN]: 'decayed of unknown causes',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_RAISED_ALARM]: 'has enemies nearby',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_CANCELED_ALARM]: 'is safe',
    [GAME_MESSAGE_IDS.NOTIFICATION_COLONY_DEATH_DESTROYED]: 'destroyed',

    [GAME_MESSAGE_IDS.RATING_TAB_TITLE]: 'Rating',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_PLACE]: 'Place',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_USERNAME]: 'Username',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_ANTS_COUNT]: 'Ants count',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_COLONIES_COUNT]: 'Colonies count',

    [GAME_MESSAGE_IDS.USER_TAB_TITLE]: 'Account',
    [GAME_MESSAGE_IDS.USER_TAB_USERNAME_LABEL]: 'Username:',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_LABEL]: 'Email:',
    [GAME_MESSAGE_IDS.USER_TAB_PASSWORD_LABEL]: 'Password:',
    [GAME_MESSAGE_IDS.USER_TAB_LOGOUT_BTN_LABEL]: 'Logout',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_VERIFIED_LABEL]: 'Verified',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_NOT_VERIFIED_LABEL]: 'Not verified',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_VERIFICATION_REQUEST_BTN_LABEL]: 'Send again',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_PASSWORD_LABEL]: 'Password:',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_OK_BTN_LABEL]: 'ok',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_CANCEL_BTN_LABEL]: 'cancel',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_USERNAME_LABEL]: 'Username:',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_OK_BTN_LABEL]: 'ok',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_CANCEL_BTN_LABEL]: 'cancel',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_NEW_PASSWORD_LABEL]: 'New password:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_NEW_PASSWORD_CONFIRM_LABEL]: 'Password confirmation:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_OLD_PASSWORD_LABEL]: 'Old password:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_OK_BTN_LABEL]: 'ok',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_CANCEL_BTN_LABEL]: 'cancel',

    [GAME_MESSAGE_IDS.MAP_PICKER_NEST_TITLE]: 'choose nest',
    [GAME_MESSAGE_IDS.MAP_PICKER_POSITION_TITLE]: 'choose place',

    [GAME_MESSAGE_IDS.GENOME_ANALIZER_TITLE]: 'Genome analyzer',

    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_WORLD]: 'World',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_START]: 'Where to start?',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_BREEDING]: 'Breeding',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_COLONIES]: 'Colonies',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ANTS]: 'Ants',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_OPERATIONS]: 'Pheromones',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_NESTS]: 'Nests',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ENEMIES]: 'Enemies',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_SPECIE]: 'Specie',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_WORLD]: `
        <p>On this planet, just like on Earth, there are four seasons: spring, summer, autumn, and winter. Each of them affects the life of ants in its own way:</p>
        <ul>
            <li>
                <b>Spring</b> — the season of awakening. Nature comes to life, but the air is still chilly. Only cold-resistant ants are able to come out of hibernation. The others are still waiting for warmth in their nests.
            </li>
            <li>
                <b>Summer</b> — the longest and most favorable season. It's warm, and food is plentiful. Summer is the mating season: the time for founding new colonies and the birth of the first females of a new species.
            </li>
            <li>
                <b>Autumn</b> — a time of declining resources. Flowers wither, nectar becomes scarce, although aphids on bushes still produce sweet honeydew for a while — one of the main resources for ants.
            </li>
            <li>
                <b>Winter</b> — the harshest season. The cold paralyzes life. Most creatures, including ants, go into hibernation. Only certain very resilient species are able to survive during this time.
            </li>
        </ul>
        <p>There are not only ants living in this world. For example, ladybugs are natural enemies of ants. They hunt aphids, with whom ants live in symbiosis. Fewer aphids means less honeydew. So ladybugs are an indirect threat to the colony's food supply.</p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_START]: `
        <p>
            <b>Main goal of the game</b> — to create your own unique ant specie, best adapted to life in a changing world. All evolution begins with a single ant, the carrier of a rare mutation. Her name is <b>Antara</b>. She is the first step of a new branch of life.
        </p>
        <p>
            To start a colony, wait for the warm season. When the temperature is suitable, open the "Breeding" tab. There you can:
        </p>
        <ul>
            <li>give birth to your primal Antara female;</li>
            <li>choose a male for her fertilization;</li>
            <li>select a location for the nest;</li>
            <li>name the new colony.</li>
        </ul>
        <p>
            <b>Nest location</b> is an important strategic choice. Ideally, choose a spot near a food source:
        </p>
        <ul>
            <li><b>a large flower</b> with nectar,</li>
            <li>or <b>a bush with aphids</b> that produce sweet honeydew.</li>
        </ul>
        <p>Food sources have a numerical indicator — the higher the value, the more food is available there.</p>
        <p>
            It's also useful if there's a <b>tree</b> nearby — it's a source of materials for strengthening the anthill. But remember: ladybugs often hibernate under tree bark, so such proximity can be dangerous.
        </p>
        <p>
            When choosing a location, make sure the food source falls within the nest area — it is outlined with a yellow border. Only then will worker ants be able to find and use these resources.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_BREEDING]: `
        <p>
            Ants have a complex but fascinating genetic system. Each individual has a genome composed of chromosomes, and those chromosomes consist of individual genes. It is the genes that determine the characteristics of an ant.
        </p>
        <p>
            When a female is fertilized, she receives a set of chromosomes from the male. This set is stored and used for laying all future eggs. The male dies after fertilization — his mission is complete.
        </p>
        <p>
            There are two types of eggs:
        </p>
        <ul>
            <li>
                <b>Unfertilized eggs</b> — contain only maternal chromosomes. Only males hatch from them.
            </li>
            <li>
                <b>Fertilized eggs</b> — have two sets of chromosomes: one from the mother, one from the father. These eggs can develop into workers, warriors, or females.
            </li>
        </ul>
        <p>
            The female already has two sets of chromosomes (inherited from her parents). During egg-laying, the genes in her chromosomes are shuffled — this process is called meiosis. As a result, each egg receives two sets of chromosomes: one maternal and one paternal.
        </p>
        <p>
            After being laid, the egg is placed in the egg chamber. There you can:
        </p>
        <ul>
            <li>give a name to the future ant,</li>
            <li>choose a care mode that will influence the ant's caste,</li>
            <li>observe its development.</li>
        </ul>
        <p>
            When the egg is ready, it must be moved to the larva chamber in time. There it will start to be fed until a new ant hatches. If you delay — the egg will spoil. If the nest runs out of food — all larvae will die.
        </p>
        <p>
            Males that grow up in the colony are not suitable for fertilizing their "own" females — their genomes are too similar. That's why females search for males from distant colonies during the nuptial flight.
        </p>
        <p>
            These "distant" males are generated based on your species' actions. If you often engage in battles — there's a higher chance of encountering strong, combative males. If you build and reinforce nests — males may appear with genes that allow the creation of additional colony nests. If your ants frequently suffer health damage from cold — the chance increases of finding a male with better cold resistance in his genes.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_COLONIES]: `
        <p>
            Ants are social creatures. They live in large communities — colonies, where each individual has its own role. The heart of the colony is the queen. She lays eggs and maintains stability. If she dies — it is a tragedy. Without her, the colony quickly declines. The queen is the longest-living of all castes.
        </p>

    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ANTS]: `
        <p>Each ant in the colony performs its own role:</p>
        <ul>
            <li><b>Queen</b> — lays eggs and monitors the condition of the nest.</li>
            <li><b>Workers</b> — search for and bring food, take care of eggs and larvae.</li>
            <li><b>Warriors</b> — guard the nest and fight enemies.</li>
            <li><b>Young females</b> — prepare for the future nuptial flight and founding of new colonies.</li>
            <li><b>Males</b> — wait for the moment to pass on their genes to distant females of the species.</li>
        </ul>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_OPERATIONS]: `
        <p>
            Ants don't speak with words, but they understand each other perfectly through <b>pheromones</b> — chemical signals that control the behavior of the colony. One scent — and the whole group acts.
        </p>
        <p>
            For example: a large beetle appears near the nest. One of the ants finds it and releases a signal pheromone. Others, sensing it, rush in to drag the beetle to the nest together.
        </p>
        <p>
            <b>Smart use of pheromones is the key to the colony's survival.</b>
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_NESTS]: `
        <p>
            Usually, a colony has a single nest, but some highly advanced ant species can have multiple nests per colony. This allows them to collect resources from distant sources that would otherwise be unreachable.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ENEMIES]: `
        <p>
            Colonies can enter into conflicts with each other. If one colony attacks another — they become <b>enemies</b>. The confrontation can be intense and prolonged, but not eternal. Over time, if the fighting stops, the colonies forget the hostility — and become neutral again.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_SPECIE]: `
        <p>
            In the "Specie" tab, you can modify the genetic composition of your ant specie. Here, genes are divided into fixed and candidate ones.
        </p>
        <ul>
            <li><b>Fixed genes</b> — these are genes already present in the majority of individuals of the specie. They are a stable part of the species.</li>
            <li><b>Candidate genes</b> — genes that have appeared in some individuals. You can make them fixed by using the button below the gene.</li>
        </ul>
        <p>
            To transfer new genes into your specie, send males on a nuptial flight. They will find a distant female of your specie and fertilize her. As a result, the male's genes will appear in the candidate list. Choose males with the best genes, send them on flights — and gradually fix those genes in your specie.
        </p>
        <p>Each ant has a set of chromosomes responsible for different aspects of its structure and behavior:</p>
        <ul>
            <li>
                <b>Body Chromosome</b> — controls basic characteristics:
                <ul class="help__stats-list">
                    <li><div class="help__icon help__icon--max-hp-icon"></div><div>health</div></li>
                    <li><div class="help__icon help__icon--hp-regen-rate-icon"></div><div>health regeneration rate</div></li>
                    <li><div class="help__icon help__icon--speed-icon"></div><div>movement speed</div></li>
                    <li><div class="help__icon help__icon--sight-distance-icon"></div><div>vision range</div></li>
                    <li><div class="help__icon help__icon--strength-icon"></div><div>strength</div></li>
                    <li><div class="help__icon help__icon--defense-icon"></div><div>combat endurance</div></li>
                    <li><div class="help__icon help__icon--appetite-icon"></div><div>appetite</div></li>
                    <li><div class="help__icon help__icon--min-temp-icon"></div><div>cold resistance</div></li>
                    <li><div class="help__icon help__icon--life-span-icon"></div><div>lifespan</div></li>
                </ul>
            </li>
            <li>
                <b>Caste Chromosome</b> — determines how the caste of the ant develops. The values of this chromosome's genes are multiplied by the corresponding genes from the body chromosome. For example: the strength gene in the body chromosome is 15, the strength gene in the caste chromosome is 2, then the phenotype strength will be 15 * 2 = 30.
            </li>
            <li>
                <b>Adaptation Chromosome</b> — allows survival in harsh conditions, such as lack of food, cold, or other challenges.
            </li>
            <li>
                <b>Ability Chromosome</b> — is responsible for special abilities, such as building additional colony nests.
            </li>
        </ul>
        <p>
            Males always have a single set of chromosomes — and that is enough for them. Other castes (workers, warriors, females, queens), born from fertilized eggs, have two sets of chromosomes.
            Genes of the same type from different sets of chromosomes compete with each other. The one that is more <b>dominant</b> will be expressed. The dominance code order (from strongest to weakest): <b>A &gt; B &gt; C &gt; D &gt; E</b>.
        </p>
        <p>
            Overall, the genetic principles here correspond to the genetics of ants from planet Earth.
        </p>
    `,
}

export {
    EN_LIBRARY
}