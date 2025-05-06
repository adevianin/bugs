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
    [GAME_MESSAGE_IDS.TAB_HELP]: '?',

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'Самкі треба вказати місце де поселитись.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'Місце для поселення вже заняте.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'Для розмноження необхідна самка.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'Для розмноження необхідна жива самка.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'Для розмноження необхідний самець із віддалених країв.',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_FEMALE]: 'Самка:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_MALE]: 'Самець:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEW_COLONY_NAME]: 'Назва нової колонії:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEST_POSITION]: 'Розміщення гнізда:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_CHOOSE_NEST_POSITION]: 'Вибрати',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_START]: 'Розмножити',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NAME]: 'Розмноження',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER]: 'Сезон розмноження почнеться через ',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NO_QUEENS]: 'Немає самиць в шлюбному льоті.',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_BORN_ANTARA]: 'Народити первинну самку',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NEXT_QUEEN]: 'наступна',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_PREV_QUEEN]: 'попередня',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NO_MALES]: 'Немає самців із віддалених країв в шлюбному льоті.',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NEXT_MALE]: 'наступний',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_PREV_MALE]: 'попередній',

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

    [GAME_MESSAGE_IDS.CLIMATE_LABEL_YEAR]: 'рік',
    [GAME_MESSAGE_IDS.SEASON_LABEL_SPRING]: 'весна',
    [GAME_MESSAGE_IDS.SEASON_LABEL_SUMMER]: 'літо',
    [GAME_MESSAGE_IDS.SEASON_LABEL_AUTUMN]: 'осінь',
    [GAME_MESSAGE_IDS.SEASON_LABEL_WINTER]: 'зима',

    [GAME_MESSAGE_IDS.STATS_LABEL_MAX_HP]: 'максимум HP',
    [GAME_MESSAGE_IDS.STATS_LABEL_HP_REGEN_RATE]: 'відновлення HP',
    [GAME_MESSAGE_IDS.STATS_LABEL_SPEED]: 'швидкість переміщення',
    [GAME_MESSAGE_IDS.STATS_LABEL_SIGHT_DISTANCE]: 'дальність зору',
    [GAME_MESSAGE_IDS.STATS_LABEL_STRENGTH]: 'сила',
    [GAME_MESSAGE_IDS.STATS_LABEL_DEFENSE]: 'захист',
    [GAME_MESSAGE_IDS.STATS_LABEL_APPETITE]: 'апетит',
    [GAME_MESSAGE_IDS.STATS_LABEL_MIN_TEMP]: 'мінімальна температура',
    [GAME_MESSAGE_IDS.STATS_LABEL_LIFE_SPAN]: 'тривалість життя',

    [GAME_MESSAGE_IDS.GENOME_LABEL_ANALIZE_GENOME]: 'аналізувати геном',
    [GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE]: 'код домінування',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_STRENGTH]: 'ген сили',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_DEFENSE]: 'ген захисту',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_MAX_HP]: 'ген макс HP',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_HP_REGEN_RATE]: 'ген відновлення HP',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_SIGHT_DISTANCE]: 'ген дальності зору',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_SPEED]: 'ген швидкості руху',
    [GAME_MESSAGE_IDS.GENE_LABEL_BODY_LIFE_SPAN]: 'ген тривалості життя',
    [GAME_MESSAGE_IDS.GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST]: 'ген будування гнізд сателітів',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_APPETITE]: 'ген апетиту',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE]: 'ген апетиту розвитку',
    [GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_COLD]: 'ген адаптації холоду',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WORKER_CASTE]: 'ген розвитку касти робітник',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WARRIOR_CASTE]: 'ген розвитку касти воїн',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_QUEEN_CASTE]: 'ген розвитку касти самка',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MALE_CASTE]: 'ген розвитку касти самець',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_STRENGTH]: 'сила',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_DEFENSE]: 'захист',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MAX_HP]: 'макс HP',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE]: 'відновлення HP',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_SPEED]: 'швидкість руху',
    [GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_LIFE_SPAN]: 'тривалість життя',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_BODY]: 'хромосома тіла',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_DEVELOPMENT]: 'хромосома розвитку',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_ADAPTATION]: 'хромосома адаптації',
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION]: 'хромосома спеціалізації',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_MATERNAL]: 'материнський набір хромосом',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_PATERNAL]: 'батьківський набір хромосом',
}

export {
    UK_LIBRARY
}