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

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'Самкі треба вказати місце де поселитись.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'Місце для поселення вже заняте.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'Для розмноження необхідна самка.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'Для розмноження необхідна жива самка.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'Для розмноження необхідний самець із віддалених країв.',

    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN]: 'Не можна будувати гніздо сателіт в колонії без королеви.!!',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED]: 'Мурахам треба вказати місце для будування гнізда.!!',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED]: 'Позиція для будування гнізда вже занята.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS]: 'Досягнуто максимальну кількість гнізд сателітів.!!',

    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN]: 'Без королеви мурахи не можуть атакувати інші гнізда.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NEST_NEEDED]: 'Мурахам треба вказати гніздо для атаки.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED]: 'Мурахам треба вказати не зруйноване гніздо для атаки.',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OPER_TOO_FEW_ANTS]: 'Занадто мало мурах для атаки.',

    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN]: 'Без королеви мурахи не можуть грабувати інші гнізда.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED]: 'Мурахам треба вказати гніздо для грабування.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED]: 'Мурахам треба вказати не зруйноване гніздо для грабування.',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_FOR_LOOT_NEEDED]: 'Мурахам треба вказати гніздо для здобичі.',

    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_FROM_NEEDED]: 'Мурахам треба вказати гніздо з якого переносити їжу.',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_TO_NEEDED]: 'Мурахам треба вказати гніздо у яке переносити їжу.',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_DIFFERENT_NESTS_NEEDED]: 'Мурахи можуть переносити їжу лише між різними гніздами своєї колонії.',

    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OPER_NEST_NEEDED]: 'Мурахам треба вказати гніздо для будування захисту.',

    [GAME_MESSAGE_IDS.BRING_BUG_OPER_NEST_NEEDED]: 'Мурахам треба вказати гніздо де помічений смачний труп жука.',
    [GAME_MESSAGE_IDS.BRING_BUG_OPER_NO_BUG_FOUND]: 'Жука біля вказаного гнізда не знайдено.',

    [GAME_MESSAGE_IDS.NEST_INLINE_NOT_SPECIFIED]: 'не задано',
    [GAME_MESSAGE_IDS.NEST_INLINE_DESTROYED]: 'зруйновано',

    [GAME_MESSAGE_IDS.NEST_SELECTOR_NOT_SELECTED]: 'не вибрано',

    [GAME_MESSAGE_IDS.INT_INPUT_MIN_MAX]: '(мін. {0}, макс. {1})!!',
    [GAME_MESSAGE_IDS.INT_INPUT_MIN]: '(мін. {0})!!',
    [GAME_MESSAGE_IDS.INT_INPUT_MAX]: '(макс. {0})!!',

    [GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH]: 'Мінімальна довжина {0}.!!',
    [GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH]: 'Максимальна довжина {0}.!!',
    [GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR]: 'Тільки букви та цифри.!!',

    [GAME_MESSAGE_IDS.POSITION_NOT_SPECIFIED]: 'не задано',

    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_PLACE]: 'Місце смерті.',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_PLACE]: 'Місце руйнування.',

    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_FULL]: '{0} год. {1} хв. {2} сек.',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_SHORT]: '{0} хв. {1} сек.',

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