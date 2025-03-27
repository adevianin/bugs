import { GAME_MESSAGE_IDS } from "../messageIds"
import { COMMON_UK_LIBRARY } from "@common/messages/msgLibraries/ukLibrary"

const UK_LIBRARY = {
    ...COMMON_UK_LIBRARY,
    [GAME_MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Старий пароль не вказано.',
    [GAME_MESSAGE_IDS.TAB_BREEDING]: 'Розмноження',
    [GAME_MESSAGE_IDS.TAB_COLONIES]: 'Колонії',
    [GAME_MESSAGE_IDS.TAB_SPECIE]: 'Вид',
    [GAME_MESSAGE_IDS.TAB_NOTIFICATIONS]: 'Сповіщення',
    [GAME_MESSAGE_IDS.TAB_RATING]: 'Рейтинг',
    [GAME_MESSAGE_IDS.TAB_ACCOUNT]: 'Акаунт',

    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN]: 'Не можна будувати гніздо сателіт в колонії без королеви.!!',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED]: 'Мурахам треба вказати місце для будування гнізда.!!',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED]: 'Позиція для будування гнізда вже занята.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS]: 'Досягнуто максимальну кількість гнізд сателітів.!!',

    [GAME_MESSAGE_IDS.INT_INPUT_MIN_MAX]: '(мін. {0}, макс. {1})!!',
    [GAME_MESSAGE_IDS.INT_INPUT_MIN]: '(мін. {0})!!',
    [GAME_MESSAGE_IDS.INT_INPUT_MAX]: '(макс. {0})!!',

    [GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH]: 'Мінімальна довжина {0}.!!',
    [GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH]: 'Максимальна довжина {0}.!!',
    [GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR]: 'Тільки букви та цифри.!!',



    // [GAME_MESSAGE_IDS.CANT_BUILD_MORE_SUB_NEST]: 'Досягнуто максимальну кількість гнізд сателітів.',
    // [GAME_MESSAGE_IDS.CANT_BUILD_SUB_NEST_FAR_AWAY]: 'Не можна будувати гніздо сателіт так далеко центрального.',
    // [GAME_MESSAGE_IDS.CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST]: 'Королеви немає в гнізді для відкладення яєць.',
    // [GAME_MESSAGE_IDS.NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG]: 'Не достатньо їжі для відкладення яєць.',
    // [GAME_MESSAGE_IDS.NOT_SUITABLE_SEASON_TO_LAY_EGG]: 'Непідходящий сезон для відкладення яєць.',
    // [GAME_MESSAGE_IDS.NO_BUG_CORPSE_IN_NEST_AREA]: 'Не видно трупів жуків на території гнізда.',
    // [GAME_MESSAGE_IDS.CANT_DESTROY_NEST_WITHOUT_LIVING_QUEEN]: 'Мурахи не можуть атакувати гніздо самі без королеви.',
    // [GAME_MESSAGE_IDS.NEST_TO_DESTROY_IS_FAR_AWAY]: 'Гніздо для атаки занадто далеко від основного гнізда.',
    // [GAME_MESSAGE_IDS.NO_NEST_TO_DESTROY]: 'Немає гнізда для атаки.',
    // [GAME_MESSAGE_IDS.CANT_PILLAGE_NEST_WITHOUT_LIVING_QUEEN]: 'Мурахи не можуть грабувати гніздо самі без королеви.',
    // [GAME_MESSAGE_IDS.NO_NEST_TO_PILLAGE]: 'Немає гнізда для пограбування.',
    // [GAME_MESSAGE_IDS.CANT_PILLAGE_WITHOUT_NEST_FOR_LOOT]: 'Не можна грабувати гніздо не маючи гніздо для здобичі.',
    // [GAME_MESSAGE_IDS.NEST_TO_PILLAGE_IS_FAR_AWAY]: 'Гніздо для грабування занадто далеко.',
    // [GAME_MESSAGE_IDS.QUEEN_IS_NECESSARY_FOR_BREEDING]: 'Для розмноження потрібна самка.',
    // [GAME_MESSAGE_IDS.LIVE_QUEEN_IS_NECESSARY_FOR_BREEDING]: 'Для розмноження потрібна жива самка.',
    // [GAME_MESSAGE_IDS.MALE_IS_NECESSARY_FOR_BREEDING]: 'Для розмноження потрібен самець.',
}

export {
    UK_LIBRARY
}