import { GAME_MESSAGE_IDS } from "../messageIds";
import { COMMON_EN_LIBRARY } from "@common/messages/msgLibraries/enLibrary";

const EN_LIBRARY = {
    ...COMMON_EN_LIBRARY,
    [GAME_MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Old password is not specified.',

    [GAME_MESSAGE_IDS.TAB_BREEDING]: 'Breeding',
    [GAME_MESSAGE_IDS.TAB_COLONIES]: 'Colonies',
    [GAME_MESSAGE_IDS.TAB_SPECIE]: 'Specie',
    [GAME_MESSAGE_IDS.TAB_NOTIFICATIONS]: 'Notifications',
    [GAME_MESSAGE_IDS.TAB_RATING]: 'Rating',
    [GAME_MESSAGE_IDS.TAB_ACCOUNT]: 'Account',
    [GAME_MESSAGE_IDS.TAB_HELP]: '?',

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'The female needs a location to settle down.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'The location for settling down is already occupied.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'A female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'A living female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'A male from distant regions is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_FEMALE]: 'Female:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_MALE]: 'Male:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEW_COLONY_NAME]: 'Name of the new colony:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEST_POSITION]: 'Nest placement:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_CHOOSE_NEST_POSITION]: 'Choose',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_START]: 'Breed',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NAME]: 'Breeding',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER]: 'The breeding season will begin in ',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NO_QUEENS]: 'There are no females in the nuptial flight.',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_BORN_ANTARA]: 'Birth the primal female',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NEXT_QUEEN]: 'next',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_PREV_QUEEN]: 'previous',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NO_MALES]: 'There are no males from distant lands in the nuptial flight.',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NEXT_MALE]: 'next',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_PREV_MALE]: 'previous',

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

    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_FULL]: '{0} hr. {1} min. {2} sec.',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_SHORT]: '{0} min. {1} sec.',


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

    [GAME_MESSAGE_IDS.GENOME_LABEL_ANALIZE_GENOME]: 'analize genome',
    [GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE]: 'domination code',
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
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION]: 'specialization chromosome',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_MATERNAL]: 'maternal set of chromosomes',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_PATERNAL]: 'paternal set of chromosomes',

}

export {
    EN_LIBRARY
}