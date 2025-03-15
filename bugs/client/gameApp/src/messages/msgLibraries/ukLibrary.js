import { MESSAGE_IDS } from "../messageIds"
import { UK_BASE_LIBRARY } from "@common/messages/msgLibraries/ukLibrary"

const UK_LIBRARY = {
    ...UK_BASE_LIBRARY,
    [MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Старий пароль не вказано.',
    [MESSAGE_IDS.TAB_BREEDING]: 'Розмноження',
    [MESSAGE_IDS.TAB_COLONIES]: 'Колонії',
    [MESSAGE_IDS.TAB_SPECIE]: 'Вид',
    [MESSAGE_IDS.TAB_NOTIFICATIONS]: 'Сповіщення',
    [MESSAGE_IDS.TAB_RATING]: 'Рейтинг',
    [MESSAGE_IDS.TAB_ACCOUNT]: 'Акаунт',
}

export {
    UK_LIBRARY
}