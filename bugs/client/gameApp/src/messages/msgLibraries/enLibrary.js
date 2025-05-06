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

}

export {
    EN_LIBRARY
}