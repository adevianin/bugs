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
}

export {
    UK_LIBRARY
}