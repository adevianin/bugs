import { COMMON_MESSAGE_IDS } from "../messageIds"

const COMMON_UK_LIBRARY = {
    [COMMON_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR]: 'Ім\'я користувача занадто коротке. Мінімально допустима довжина — {0}.',
    [COMMON_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR]: 'Ім\'я користувача занадто довге. Максимально допустима довжина — {0}.',
    [COMMON_MESSAGE_IDS.USERNAME_INVALID_CHARS]: 'Ім\'я користувача містить недопустимі символи.',
    [COMMON_MESSAGE_IDS.USERNAME_TAKEN]: 'Це ім\'я користувача вже зайняте.',
    [COMMON_MESSAGE_IDS.USERNAME_NEEDED]: 'Ім\'я користувача порожнє.',
    [COMMON_MESSAGE_IDS.EMAIL_INVALID]: 'Електронна адреса недійсна.',
    [COMMON_MESSAGE_IDS.EMAIL_TAKEN]: 'Електронна адреса вже зайнята.',
    [COMMON_MESSAGE_IDS.EMAIL_NEEDED]: 'Електронну адресу не вказано.',
    [COMMON_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR]: 'Пароль занадто короткий. Мінімально допустима довжина — {0}.',
    [COMMON_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR]: 'Пароль занадто довгий. Максимально допустима довжина — {0}.',
    [COMMON_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID]: 'Паролі не співпадають.',
    [COMMON_MESSAGE_IDS.PASSWORD_NEEDED]: 'Пароль не вказано.',
    [COMMON_MESSAGE_IDS.NOT_VALID_PASSWORD_OR_EMAIL]: 'Неправильний пароль або електронна адреса.',
    [COMMON_MESSAGE_IDS.PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED]: 'Введений пароль неправильний. Електронну адресу не було змінено.',
    [COMMON_MESSAGE_IDS.OLD_PASSWORD_IS_NOT_VALID_PASSWORD_NOT_CHANGED]: 'Введений старий пароль неправильний. Пароль не було змінено.',
    [COMMON_MESSAGE_IDS.RESET_PASSWORD_LINK_EXPIRED]: 'Посилання для відновлення пароля недійсне або застаріле. Будь ласка, запросіть нове посилання.',
    [COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG]: 'Щось пішло не так.',
}

export {
    COMMON_UK_LIBRARY
}