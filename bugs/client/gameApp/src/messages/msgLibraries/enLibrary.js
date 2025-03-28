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

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'The female needs a location to settle down.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'The location for settling down is already occupied.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'A female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'A living female is required for breeding.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'A male from distant regions is required for breeding.',

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

    [GAME_MESSAGE_IDS.NEST_INLINE_NOT_SPECIFIED]: 'not specified',
    [GAME_MESSAGE_IDS.NEST_INLINE_DESTROYED]: 'destroyed',

    [GAME_MESSAGE_IDS.NEST_SELECTOR_NOT_SELECTED]: 'not selected',

    [GAME_MESSAGE_IDS.INT_INPUT_MIN_MAX]: '(min. {0}, max. {1})',
    [GAME_MESSAGE_IDS.INT_INPUT_MIN]: '(min. {0})',
    [GAME_MESSAGE_IDS.INT_INPUT_MAX]: '(max. {0})',

    [GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH]: 'Minimum length {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH]: 'Maximum length {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR]: 'Letters and numbers only.',

    // [GAME_MESSAGE_IDS.CANT_BUILD_MORE_SUB_NEST]: 'The maximum number of satellite nests has been reached.',
    // [GAME_MESSAGE_IDS.CANT_BUILD_SUB_NEST_FAR_AWAY]: 'A satellite nest cannot be built so far from the central nest.',
    // [GAME_MESSAGE_IDS.CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST]: 'The queen is not in the nest to lay eggs.',
    // [GAME_MESSAGE_IDS.NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG]: 'Not enough food to lay eggs.',
    // [GAME_MESSAGE_IDS.NOT_SUITABLE_SEASON_TO_LAY_EGG]: 'It is not the right season for laying eggs.',
    // [GAME_MESSAGE_IDS.NO_BUG_CORPSE_IN_NEST_AREA]: 'No beetle corpses are visible within the nest\'s territory.',
    // [GAME_MESSAGE_IDS.CANT_DESTROY_NEST_WITHOUT_LIVING_QUEEN]: 'Ants cannot attack a nest on their own without the queen.',
    // [GAME_MESSAGE_IDS.NEST_TO_DESTROY_IS_FAR_AWAY]: 'The target nest is too far from the main nest to attack.',
    // [GAME_MESSAGE_IDS.NO_NEST_TO_DESTROY]: 'There is no nest available to attack.',
    // [GAME_MESSAGE_IDS.CANT_PILLAGE_NEST_WITHOUT_LIVING_QUEEN]: 'Ants cannot raid a nest on their own without the queen.',
    // [GAME_MESSAGE_IDS.NO_NEST_TO_PILLAGE]: 'There is no nest available to raid.',
    // [GAME_MESSAGE_IDS.CANT_PILLAGE_WITHOUT_NEST_FOR_LOOT]: 'A nest cannot be raided without having a nest prepared for loot.',
    // [GAME_MESSAGE_IDS.NEST_TO_PILLAGE_IS_FAR_AWAY]: 'The nest to raid is too far away.',
    // [GAME_MESSAGE_IDS.QUEEN_IS_NECESSARY_FOR_BREEDING]: 'A female is required for reproduction.',
    // [GAME_MESSAGE_IDS.LIVE_QUEEN_IS_NECESSARY_FOR_BREEDING]: 'A living female is required for reproduction.',
    // [GAME_MESSAGE_IDS.MALE_IS_NECESSARY_FOR_BREEDING]: 'A male is required for reproduction.',

}

export {
    EN_LIBRARY
}