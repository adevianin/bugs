import { GAME_MESSAGE_IDS } from "../messageIds"
import { COMMON_UK_LIBRARY } from "@common/messages/msgLibraries/ukLibrary"

const UK_LIBRARY = {
    ...COMMON_UK_LIBRARY,
    [GAME_MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Старий пароль не вказано.',

    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED]: 'Самкі треба вказати місце де поселитись.',
    [GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED]: 'Місце для поселення вже заняте.',
    [GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED]: 'Для розмноження необхідна самка.',
    [GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED]: 'Для розмноження необхідна жива самка.',
    [GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED]: 'Для розмноження необхідний самець із віддалених країв.',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_FEMALE]: 'Вибери самку:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_MALE]: 'Вибери самця:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEW_COLONY_NAME]: 'Назва нової колонії:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_NEST_POSITION]: 'Розміщення гнізда:',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_CHOOSE_NEST_POSITION]: 'Вибрати',
    [GAME_MESSAGE_IDS.BREEDING_LABEL_START]: 'Розмножити',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_FULL]: '{0} год. {1} хв. {2} сек.',
    [GAME_MESSAGE_IDS.NUPTIAL_TAB_TIME_SHORT]: '{0} хв. {1} сек.',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NAME]: 'Розмноження',
    [GAME_MESSAGE_IDS.NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER]: 'Сезон розмноження почнеться через ',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_NO_QUEENS]: 'Немає самиць в шлюбному льоті.',
    [GAME_MESSAGE_IDS.QUEEN_SELECTOR_LABEL_BORN_ANTARA]: 'Народити самку Antara',
    [GAME_MESSAGE_IDS.MALE_SELECTOR_LABEL_NO_MALES]: 'Немає самців із віддалених країв в шлюбному льоті.',

    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN]: 'Не можна будувати гніздо сателіт в колонії без королеви.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED]: 'Мурахам треба вказати місце для будування гнізда.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED]: 'Позиція для будування гнізда вже занята.',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS]: 'Досягнуто максимальну кількість гнізд сателітів.',

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

    [GAME_MESSAGE_IDS.INT_INPUT_MIN_MAX]: '(мін. {0}, макс. {1})',
    [GAME_MESSAGE_IDS.INT_INPUT_MIN]: '(мін. {0})',
    [GAME_MESSAGE_IDS.INT_INPUT_MAX]: '(макс. {0})',

    [GAME_MESSAGE_IDS.TEXT_INPUT_MIN_STR_LENGTH]: 'Мінімальна довжина {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_MAX_STR_LENGTH]: 'Максимальна довжина {0}.',
    [GAME_MESSAGE_IDS.TEXT_INPUT_INVALID_CHAR]: 'Тільки букви та цифри.',

    [GAME_MESSAGE_IDS.POSITION_NOT_SPECIFIED]: 'не задано',

    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_PLACE]: 'Місце смерті.',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_PLACE]: 'Місце руйнування.',

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
    [GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE]: 'код домінування:',
    [GAME_MESSAGE_IDS.GENE_LABEL_VALUE]: 'значення:',
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
    [GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION]: 'хромосома здібностей',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_MATERNAL]: 'материнський набір хромосом',
    [GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_PATERNAL]: 'батьківський набір хромосом',

    [GAME_MESSAGE_IDS.COLONIES_TAB_TITLE]: 'Колонії',
    [GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_NO_COLONIES]: 'Немає колоній.',
    [GAME_MESSAGE_IDS.COLONIES_TAB_LABEL_COLONY_SELECTOR]: 'Колонія:',
    [GAME_MESSAGE_IDS.COLONIES_TAB_SHOW_COLONY_BTN]: 'показать',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ANTS]: 'мурахи',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_OPERATIONS]: 'феромони',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_NESTS]: 'гнізда',
    [GAME_MESSAGE_IDS.COLONY_MANAGER_TAB_NAME_ENEMIES]: 'вороги',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_NAME]: 'ім\'я',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_TYPE]: 'тип',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_NEST]: 'гніздо',
    [GAME_MESSAGE_IDS.ANTS_LIST_COL_NAME_MORE]: 'більше',
    [GAME_MESSAGE_IDS.ANTS_LIST_LABEL_NO_ANTS]: 'в колонії немає мурах',

    [GAME_MESSAGE_IDS.ANT_TYPE_QUEEN]: 'Королева',
    [GAME_MESSAGE_IDS.ANT_TYPE_FEMALE]: 'Самка',
    [GAME_MESSAGE_IDS.ANT_TYPE_MALE]: 'Самець',
    [GAME_MESSAGE_IDS.ANT_TYPE_WORKER]: 'Робітник',
    [GAME_MESSAGE_IDS.ANT_TYPE_WARRIOR]: 'Воїн',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_LABEL]: 'поведінка захисту',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NONE]: 'не захищає',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_NEST]: 'тільки гніздо',
    [GAME_MESSAGE_IDS.ANT_GUARDIAN_BEHAVIOR_TYPE_COLONY]: 'вся колонія',
    [GAME_MESSAGE_IDS.ANT_COOPERATIVE_BEHAVIOR_LABEL]: 'реагує на феромони',
    [GAME_MESSAGE_IDS.ANT_NUPTIAL_MALE_GENOME_LABEL]: 'геном від шлюбного самця',
    [GAME_MESSAGE_IDS.ANT_GENOME_LABEL]: 'геном мурахи',
    [GAME_MESSAGE_IDS.ANT_AGE_LABEL]: 'вік',
    [GAME_MESSAGE_IDS.ANT_CURRENT_ACTIVITY_LABEL]: 'занятість',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_NOTHING]: 'нічим не займаюсь',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_PREPARING_FOR_HIBERNATION]: 'готуюсь до зимової сплячки',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_HIBERNATION]: 'зимова сплячка',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_PATROLING_NEST_TERRITORY]: 'патрулюю територію гнізда',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_COLLECTING_FOOD]: 'збираю їжу',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_FEEDING_MYSELF]: 'йду поїсти',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_HOME_NEST]: 'захищаю гніздо',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_MYSELF]: 'захищаюсь',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_DEFENDING_COLONY]: 'захищаю колонію',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_SHELTERING_IN_NEST]: 'ховаюсь у гнізді',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_IN_OPERATION]: 'слідує феромонам',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_GOING_HOME]: 'йду додому',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_WATCHING_NEST]: 'слідкую за гніздом',
    [GAME_MESSAGE_IDS.ANT_ACTIVITY_BUILDING_MAIN_NEST]: 'будую основне гніздо колонії',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_LABEL]: 'голод',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_HUNGRY]: 'голодний',
    [GAME_MESSAGE_IDS.ANT_IS_HUNGRY_STATE_NOT_HUNGRY]: 'ситий',
    [GAME_MESSAGE_IDS.ANT_NUPTIAL_FLIGHT_BTN_LABEL]: 'шлюбний політ',
    [GAME_MESSAGE_IDS.ANT_SHOW_BTN_LABEL]: 'показать',
    [GAME_MESSAGE_IDS.ANT_NAME_ADJECTIVES]: [
        "Швидкий",
        "Тіньовий",
        "Кмітливий",
        "Твердий",
        "Прудкий",
        "Чорнявий",
        "Блискавичний",
        "Гострий",
        "Скритний",
        "Стародавній",
        "Непомітний",
        "Сухий",
        "Вогняний",
        "Крихітний",
        "Залізний",
        "Пильний",
        "Мудрий",
        "Хижий",
        "Міцний",
        "Хитрий",
        "Кам'яний",
        "Завзятий",
        "Гнучкий",
        "Мерехтливий",
        "Витривалий",
        "Дикий",
        "Темний",
        "Гостролапий",
        "Безстрашний",
        "Лісовий"
    ],
    [GAME_MESSAGE_IDS.ANT_NAME_NOUNS]: [
        "Шукач",
        "Будівничий",
        "Слідун",
        "Трудівник",
        "Оборонець",
        "Розвідник",
        "Пожирач",
        "Ловець",
        "Борець",
        "Хижак",
        "Мандрівник",
        "Блукач",
        "Вартовий",
        "Збирач",
        "Копач",
        "Спостерігач",
        "Ткач",
        "Сталкер",
        "Жнець",
        "Мисливець",
        "Бунтар",
        "Мовчун",
        "Вивідник",
        "Будівник",
        "Слідопит",
        "Вогнеходець",
        "Пильник",
        "Підземник",
        "Осадач",
        "Дозорець"
    ],

    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_NAME]: 'назва',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_STATUS]: 'статус',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_HIRING]: 'залучені мурахи',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_ACTIONS]: 'дії',
    [GAME_MESSAGE_IDS.OPERATIONS_LIST_NO_OPERATIONS_LABEL]: 'Немає активних феромонних сигналів.',

    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_TITLE]: 'Феромонні сигнали:',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_NEW_SUB_NEST_BTN_LABEL]: 'будувать гніздо сателіт',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_DESTROY_NEST_BTN_LABEL]: 'зруйнувать гніздо',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_PILLAGE_NEST_BTN_LABEL]: 'пограбувать гніздо',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_TRANSPORT_FOOD_BTN_LABEL]: 'перенести їжу',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_BUILD_FORTIFICATIONS_BTN_LABEL]: 'будувать укріплення гнізда',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_BRING_BUG_CORPSE_BTN_LABEL]: 'принести жука',
    [GAME_MESSAGE_IDS.OPERATIONS_CREATOR_CANCEL_OPERATION_CREATING_BTN_LABEL]: 'назад',

    [GAME_MESSAGE_IDS.OPERATION_CREATOR_WORKERS_COUNT]: 'кількість робочих:',
    [GAME_MESSAGE_IDS.OPERATION_CREATOR_WARRIORS_COUNT]: 'кількість воїнів:',
    [GAME_MESSAGE_IDS.OPERATION_CREATOR_START_BTN_LABEL]: 'поширити феромонний сигнал',

    [GAME_MESSAGE_IDS.OPERATION_STATUS_IN_PROGRESS_LABEL]: 'в процесі',
    [GAME_MESSAGE_IDS.OPERATION_STATUS_HIRING_LABEL]: 'збір мурах',
    [GAME_MESSAGE_IDS.OPERATION_STATUS_DONE_LABEL]: 'виконано',
    [GAME_MESSAGE_IDS.OPERATION_ACTIVATE_BTN_LABEL]: 'показать',
    [GAME_MESSAGE_IDS.OPERATION_STOP_BTN_LABEL]: 'зупинить',
    [GAME_MESSAGE_IDS.OPERATION_DEACTIVATE_BTN_LABEL]: 'приховать',
    [GAME_MESSAGE_IDS.OPERATION_HIRING_WORKERS_STATUS_LABEL]: 'робочі',
    [GAME_MESSAGE_IDS.OPERATION_HIRING_WARRIORS_STATUS_LABEL]: 'воїни',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_NEW_SUBNEST]: 'будування гнізда сателіта',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_DESTROY_NEST]: 'атака ворожого гнізда',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_PILLAGE_NEST]: 'грабування ворожого гнізда',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_TRANSPORT_FOOD]: 'перенесення їжі',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BUILD_FORTIFICATION]: 'будування укріплень',
    [GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BRING_BUG]: 'перенесення жука в гніздо',

    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_TITLE]: 'Будування гнізда сателіта',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL]: 'позиція гнізда:',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_CHOOSE_NEST_POSITION_BTN_LABEL]: 'вибрать',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_WORKER_REQUIREMENTS_LABEL]: '*Робочі мурахи повинні мати ген будування гнізд сателітів',
    [GAME_MESSAGE_IDS.NEW_SUB_NEST_OP_CR_NEST_NAME_LABEL]: 'назва гнізда:',

    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_TITLE]: 'Зруйнувать гніздо',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_NEST_TO_DESTROY_LABEL]: 'гніздо:',
    [GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_CHOOSE_NEST_BTN_LABEL]: 'вибрать',

    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_TITLE]: 'Пограбувать гніздо',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_TO_PILLAGE_LABEL]: 'гніздо для пограбування:',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_CHOOSE_NEST_TO_PILLAGE_BTN_LABEL]: 'вибрать',
    [GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_FOR_LOOT_LABEL]: 'гніздо для здобичі:',

    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_TITLE]: 'Перенести їжу',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_FROM_NEST_LABEL]: 'із гнізда:',
    [GAME_MESSAGE_IDS.TRANSPORT_FOOD_OP_CR_TO_NEST_LABEL]: 'в гніздо:',

    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OP_CR_TITLE]: 'Будувать укріплення гнізда',
    [GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OP_CR_NEST_LABEL]: 'гніздо:',

    [GAME_MESSAGE_IDS.BRING_BUG_OP_CR_TITLE]: 'Принести жука',
    [GAME_MESSAGE_IDS.BRING_BUG_OP_CR_NEST_LABEL]: 'гніздо:',

    [GAME_MESSAGE_IDS.NESTS_TAB_NEST_LABEL]: 'гніздо:',
    [GAME_MESSAGE_IDS.NESTS_TAB_SHOW_NEST_BTN]: 'показать',

    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_NAME_LABEL]: 'назва:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_FOOD_COUNT_LABEL]: 'їжі всередині:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_MAIN_TAB_IS_NEST_MAIN_LABEL]: 'чи основне гніздо:',

    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_TITLE]: 'Камера яєць',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_FERTILIZE_LABEL]: 'запліднить',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_BTN_LABEL]: 'відкласти яйце',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_NAME]: 'ім\'я',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_STATE]: 'прогрес',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_CASTE]: 'каста',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_ACTIONS]: 'дії',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_TITLE]: 'Відкладення яєць:',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NO_EGGS_LABEL]: 'Немає яєць.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_EGG_TO_LARVA_BTN_LABEL]: 'в личинки',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_DELETE_EGG_BTN_LABEL]: 'відкинути',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST]: 'Королеви немає в гнізді для відкладення яєць.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG]: 'Не достатньо їжі в гнізді для відкладення яєць.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NOT_SUITABLE_SEASON_TO_LAY_EGG]: 'Непідходящий сезон для відкладення яєць.',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_TITLE]: 'Камера личинок',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_NAME]: 'ім\'я',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_PROGRESS]: 'прогрес',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_CASTE]: 'каста',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_COL_TITLE_ACTIONS]: 'дії',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_REMOVE_LARVA_BTN_LABEL]: 'відкинуть',
    [GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_NO_LARVA_LABEL]: 'Немає личинок.',

    [GAME_MESSAGE_IDS.EGG_STATE_DEVELOPMENT]: 'розвивається',
    [GAME_MESSAGE_IDS.EGG_STATE_READY]: 'готове',
    [GAME_MESSAGE_IDS.EGG_STATE_SPOILED]: 'зіпсоване',

    [GAME_MESSAGE_IDS.ENEMIES_TAB_NO_ENEMY_LABEL]: 'Колонія не має ворогів.',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_SHOW_ENEMY_BTN_LABEL]: 'показать',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_TABLE_COL_COLONY_NAME]: 'назва ворожої колонії',
    [GAME_MESSAGE_IDS.ENEMIES_TAB_TABLE_COL_ACTIONS]: 'дії',

    [GAME_MESSAGE_IDS.SPECIE_BUILDER_TAB_TITLE]: 'Конструктор виду',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_BODY]: 'тіло',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_DEVELOPMENT]: 'каста',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_ADAPTATION]: 'адаптація',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_CHROMOSOME_EDITOR_LABEL_SPECIALIZATION]: 'здібність',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_ACTIVATED_GENES_TITLE]: 'Закріплені гени:',
    [GAME_MESSAGE_IDS.SPECIE_BUILDER_NOT_ACTIVATED_GENES_TITLE]: 'Кандидатні гени:',

    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_TITLE]: 'Сповіщення',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_COL_TITLE_EVENT]: 'Подія',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_COL_TITLE_YEAR]: 'Коли',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_SHOW_MORE_BTN_LABEL]: 'Раніше',
    [GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_NO_NOTIFICATIONS_LABEL]: 'Сповіщень немає',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_ANT]: 'Мураха',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_NEST]: 'Гніздо',
    [GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_COLONY]: 'Колонія',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_COMBAT]: 'загинув у бою',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_FREEZED]: 'помер від холоду',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_AGED]: 'помер від старості',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_HUNGER]: 'помер з голоду',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_WITHOUT_HOME]: 'помер без дому',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_NUPTIAL_FLIGHT]: 'помер в шлюбному льоті',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_UNKNOWN]: 'помер з невідомих причин',
    [GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_BURIED_IN_NEST]: 'загинув в зруйнованому гнізді',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_COMBAT]: 'зруйновано',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_DECAY]: 'завалилось',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_UNKNOWN]: 'завалилось з невідомих причин',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_RAISED_ALARM]: 'має ворогів поряд',
    [GAME_MESSAGE_IDS.NOTIFICATION_NEST_CANCELED_ALARM]: 'в безпеці',
    [GAME_MESSAGE_IDS.NOTIFICATION_COLONY_DEATH_DESTROYED]: 'розбита',

    [GAME_MESSAGE_IDS.RATING_TAB_TITLE]: 'Рейтинг',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_PLACE]: 'Місце',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_USERNAME]: 'Ім\'я користувача',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_ANTS_COUNT]: 'Кількість мурах',
    [GAME_MESSAGE_IDS.RATING_TAB_COL_NAME_COLONIES_COUNT]: 'Кількість колоній',

    [GAME_MESSAGE_IDS.USER_TAB_TITLE]: 'Акаунт',
    [GAME_MESSAGE_IDS.USER_TAB_USERNAME_LABEL]: 'Username:',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_LABEL]: 'Email:',
    [GAME_MESSAGE_IDS.USER_TAB_PASSWORD_LABEL]: 'Пароль:',
    [GAME_MESSAGE_IDS.USER_TAB_LOGOUT_BTN_LABEL]: 'Вийти',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_VERIFIED_LABEL]: 'Підтверджений',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_NOT_VERIFIED_LABEL]: 'Не підтверджений',
    [GAME_MESSAGE_IDS.USER_TAB_EMAIL_VERIFICATION_REQUEST_BTN_LABEL]: 'Відправити іще',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_PASSWORD_LABEL]: 'Пароль:',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_OK_BTN_LABEL]: 'зберегти',
    [GAME_MESSAGE_IDS.EMAIL_EDITOR_CANCEL_BTN_LABEL]: 'відмінити',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_USERNAME_LABEL]: 'Username:',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_OK_BTN_LABEL]: 'зберегти',
    [GAME_MESSAGE_IDS.USERNAME_EDITOR_CANCEL_BTN_LABEL]: 'відмінити',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_NEW_PASSWORD_LABEL]: 'Новий пароль:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_NEW_PASSWORD_CONFIRM_LABEL]: 'Підтвердження пароля:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_OLD_PASSWORD_LABEL]: 'Старий пароль:',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_OK_BTN_LABEL]: 'зберегти',
    [GAME_MESSAGE_IDS.PASSWORD_EDITOR_CANCEL_BTN_LABEL]: 'відмінити',

    [GAME_MESSAGE_IDS.MAP_PICKER_NEST_TITLE]: 'вибери гніздо',
    [GAME_MESSAGE_IDS.MAP_PICKER_POSITION_TITLE]: 'вибери місце',

    [GAME_MESSAGE_IDS.GENOME_ANALIZER_TITLE]: 'Аналізатор геному',

    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_WORLD]: 'Світ',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_START]: 'З чого почати?',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_BREEDING]: 'Розмноження',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_COLONIES]: 'Колонії',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ANTS]: 'Мурахи',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_OPERATIONS]: 'Феромони',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_NESTS]: 'Гнізда',
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ENEMIES]: 'Вороги',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_SPECIE]: 'Вид',
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_WORLD]: `
        <p>На цій планеті, як і на Землі, є чотири пори року: весна, літо, осінь і зима. Кожна з них впливає на життя мурах по-своєму:</p>
        <ul>
            <li>
                <b>Весна</b> — пора пробудження. Природа оживає, але повітря ще прохолодне. Лише холодостійкі мурахи здатні вийти зі сплячки. Інші ще чекають тепла в гніздах.
            </li>
            <li>
                <b>Літо</b> — найдовший і найсприятливіший сезон. Тепло, їжі вдосталь. Саме влітку настає шлюбний період: час створення нових колоній і народження перших самок нового виду.
            </li>
            <li>
                <b>Осінь</b> — час зменшення ресурсів. Квіти в'януть, нектару стає менше, хоча попелиці на кущах ще деякий час виділяють солодку медяну росу — один із головних ресурсів для мурах.
            </li>
            <li>
                <b>Зима</b> — найсуворіший сезон. Холод паралізує життя. Більшість істот, включно з мурахами, впадає в сплячку. Лише окремі, дуже витривалі види здатні вижити й у цей період.
            </li>
        </ul>
        <p>У світі живуть не тільки мурахи. Наприклад, жуки-сонечки — природні вороги мурах. Вони полюють на попелиць, з якими мурахи живуть у симбіозі. Менше попелиць — менше медяної роси. Тож сонечка — це опосередкована загроза харчовим запасам колонії.</p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_START]: `
        <p>
            <b>Головна мета гри</b> — створити власний унікальний вид мурах, найбільш пристосований до життя у мінливому світі. Вся еволюція починається з однієї-єдиної мурахи, носія рідкісної мутації. Її ім'я — <b>Antara</b>. Вона — перша сходинка нової гілки життя.
        </p>
        <p>
            Щоб започаткувати колонію, дочекайся теплого сезону. Коли температура дозволяє, відкрий вкладку "Розмноження". Там ти зможеш:
        </p>
        <ul>
            <li>народити свою первинну самку Antara;</li>
            <li>вибрати для неї самця для запліднення;</li>
            <li>обрати місце для гнізда;</li>
            <li>дати назву новій колонії.</li>
        </ul>
        <p>
            <b>Розташування гнізда</b> — важливий стратегічний вибір. Найкраще — обрати місце біля джерела їжі:
        </p>
        <ul>
            <li><b>великої квітки</b> з нектаром,</li>
            <li>або <b>куща з попелицями</b>, які виділяють солодку медяну росу.</li>
        </ul>
        <p>Джерела їжі мають числовий показник, чим більше значення тим більше там їжі.</p>
        <p>
            Корисно, якщо поруч також росте <b>дерево</b> — воно є джерелом матеріалів для укріплення мурашника. Але пам'ятай: жуки-сонечки часто зимують під корою дерев, тому таке сусідство може бути небезпечним.
        </p>
        <p>
            При виборі місця переконайся, що джерело їжі потрапляє в область гнізда — вона обведена жовтою лінією. Лише тоді робочі мурахи зможуть знаходити і використовувати ці ресурси.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_BREEDING]: `
        <p>
            У мурах складна, але цікава генетична система. Кожна особина має геном, що складається з хромосом, а ті — з окремих генів. Саме від генів залежить, якими будуть характеристики мурахи.
        </p>
        <p>
            Коли самка запліднюється, вона отримує набір хромосом від самця. Цей набір зберігається і використовується для відкладання всіх майбутніх яєць. А самець після запліднення помирає, його місія виконана.
        </p>
        <p>
            Є два типи яєць:
        </p>
        <ul>
            <li>
                <b>Незапліднені яйця</b> — містять лише материнські хромосоми. З них народжуються тільки самці.
            </li>
            <li>
                <b>Запліднені яйця</b> — мають два набори хромосом: один від матері, один від батька. З таких яєць можуть народитись робочі, воїни або самки.
            </li>
        </ul>
        <p>
            У самки вже є два набори хромосом (успадковані від її батьків). Під час відкладання яйця гени її хромосом перетасовуються, цей процес називається мейоз. У результаті кожне яйце отримує два набори хромосом: материнський(після мейозу) і батьківський(від самця). 
        </p>
        <p>
            Після відкладення яйце потрапляє в камеру для яєць. В ній можна:
        </p>
        <ul>
            <li>дати ім'я майбутньому мурахі,</li>
            <li>вибрати режим догляду, що вплине на касту мурахи,</li>
            <li>спостерігати за його дозріванням.</li>
        </ul>
        <p>
            Коли яйце готове — його треба вчасно перенести до камери личинок. Тут його почнуть годувати, аж поки не вилупиться новий мураха. Якщо зволікати — яйце зіпсується. Якщо закінчиться їжа в гнізді — загинуть усі личинки.
        </p>
        <p>
            Самці, що виросли в колонії, не підходять для запліднення "своїх" самок — їхній геном надто схожий. Тому самки під час шлюбного льоту шукають самців з далеких колоній.
        </p>
        <p>
            Ці "далекі" самці формуються відповідно до дій твого виду. Якщо часто ведеш бої — зростає шанс, що знайдуться сильні, бойові самці. Якщо будуєш, укріпляєш гнізда — можуть знайтись самці з генами, що дають змогу створювати додаткові гнізда колонії. Якщо мурахи часто отримують шкоду здоров'ю від холоду, то росте шанс знайти самця з кращою холодостійкістю в генах.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_COLONIES]: `
        <p>
            Мурахи — соціальні істоти. Вони живуть великими спільнотами — колоніями, де кожна особина має своє призначення. Серце колонії — королева. Вона відкладає яйця і підтримує стабільність. Якщо вона помирає — це трагедія. Без неї колонія швидко занепадає. Королева — найдовговічніша з усіх каст.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ANTS]: `
        <p>Кожен мураха в колонії виконує свою роль:</p>
        <ul>
            <li><b>Королева</b> — відкладає яйця, слідкує за станом гнізда.</li>
            <li><b>Робочі</b> — шукають та приносять їжу, обслуговують яйця і личинок.</li>
            <li><b>Воїни</b> — охороняють гніздо, борються з ворогами.</li>
            <li><b>Молоді самки</b> — готуються до майбутнього шлюбного льоту та створення нових колоній.</li>
            <li><b>Самці</b> — чекають моменту, щоб передати свої гени далеким самкам виду.</li>
        </ul>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_OPERATIONS]: `
        <p>
            Мурахи не розмовляють словами, але чудово розуміють одне одного через <b>феромони</b> — хімічні сигнали, що керують поведінкою колонії. Один запах — і вся група діє.
        </p>
        <p>
            Наприклад: біля гнізда з'явився великий жук. Хтось із мурах його знайшов і виділяє позивний феромон. Інші, відчувши його, біжать, щоб разом затягнути жука до гнізда.
        </p>
        <p>
            <b>Розумне використання феромонів — ключ до виживання колонії.</b>
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_NESTS]: `
        <p>
            Зазвичай колонія має одне гніздо, але деякі дуже продвинуті види мурах можуть мати кілька гнізд на колонію. Це дозволяє збирати ресурси з віддалених джерел, які інакше були б недоступні. 
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ENEMIES]: `
        <p>
            Колонії можуть вступати у конфлікти між собою. Якщо одна колонія нападає на іншу — вони стають <b>ворогами</b>. Протистояння може бути жорстким і затяжним, але не вічним. З часом, якщо битви припиняються, колонії забувають ворожнечу — і знову стають нейтральними.
        </p>
    `,
    [GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_SPECIE]: `
        <p>
            У вкладці "Вид" відбувається зміна генетичного складу твого виду мурах. Тут гени поділяються на закріплені та кандидатні.
        </p>
        <ul>
            <li><b>Закріплені гени</b> — це ті, що вже наявні у більшості особин виду. Вони є стабільною частиною виду.</li>
            <li><b>Кандидатні гени</b> — гени, що з'явились у деяких особин. Їх можна зробити закріпленими, скориставшись кнопкою під геном.</li>
        </ul>
        <p>
            Щоб передавати нові гени у свій вид, відправляй самців у шлюбний літ. Вони знайдуть далеку самку твого виду та запліднять її. У результаті, гени самця з'являться у списку кандидатних. Вибирай самців з найкращими генами, відправляй їх у літ — і поступово закріплюй ці гени у своєму виді.
        </p>
        <p>Кожна мураха має набір хромосом, які відповідають за різні аспекти її будови й поведінки:</p>
        <ul>
            <li>
                <b>Хромосома Тіла</b> — керує базовими характеристиками:
                <ul class="help__stats-list">
                    <li><div class="help__icon help__icon--max-hp-icon"></div><div>здоров'я</div></li>
                    <li><div class="help__icon help__icon--hp-regen-rate-icon"></div><div>швидкість відновлення здоров'я</div></li>
                    <li><div class="help__icon help__icon--speed-icon"></div><div>швидкість руху</div></li>
                    <li><div class="help__icon help__icon--sight-distance-icon"></div><div>дальність зору</div></li>
                    <li><div class="help__icon help__icon--strength-icon"></div><div>сила</div></li>
                    <li><div class="help__icon help__icon--defense-icon"></div><div>стійкість у бою</div></li>
                    <li><div class="help__icon help__icon--appetite-icon"></div><div>апетит</div></li>
                    <li><div class="help__icon help__icon--min-temp-icon"></div><div>холодостійкість</div></li>
                    <li><div class="help__icon help__icon--life-span-icon"></div><div>тривалість життя</div></li>
                </ul>
            </li>
            <li>
                <b>Хромосома Касти</b> — визначає, як розвивається каста мурахи. Значення генів цієї хромосоми множаться на відповідні гени з хромосоми тіла. Наприклад: ген сили в хромосомі тіла має значення 15, ген сили в хромосомі касти має значення 2, тоді у фенотипі мурахи сила буде 15 * 2 = 30.
            </li>
            <li>
                <b>Хромосома Адаптації</b> — дозволяє виживати в складних умовах, коли не вистачає їжі або холод чи інше.
            </li>
            <li>
                <b>Хромосома Здібностей</b> — відповідає за особливі уміння, наприклад, будівництво додаткових гнізд колонії.
            </li>
        </ul>
        <p>
            Самці завжди мають один набір хромосом — і їм цього достатньо. Інші касти (робочі, воїни, самки, королеви), народжені із запліднених яєць, мають два набори хромосом.
            Гени одного типу з іншого набору хромосом конкурують між собою. Проявиться той, що є більш <b>домінантним</b>. Порядок кодів домінантності генів (від найсильнішого до найслабшого): <b>A &gt; B &gt; C &gt; D &gt; E</b>.
        </p>
        <p>
            Загалом, принципи генетики тут відповідають генетиці мурах із планети Земля.
        </p>
    `,

}

export {
    UK_LIBRARY
}