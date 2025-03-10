import { BASE_MESSAGE_IDS } from "../messageIds"

const UK_BASE_LIBRARY = {
    [BASE_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR]: 'Ім\'я користувача занадто коротке. Мінімально допустима довжина — {0}.',
    [BASE_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR]: 'Ім\'я користувача занадто довге. Максимально допустима довжина — {0}.',
    [BASE_MESSAGE_IDS.USERNAME_INVALID_CHARS]: 'Ім\'я користувача містить недопустимі символи.',
    [BASE_MESSAGE_IDS.USERNAME_TAKEN]: 'Це ім\'я користувача вже зайняте.',
    [BASE_MESSAGE_IDS.EMAIL_INVALID_FORMAT]: 'Електронна адреса недійсна.',
    [BASE_MESSAGE_IDS.EMAIL_TAKEN]: 'Електронна адреса вже зайнята.',
    [BASE_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR]: 'Пароль занадто короткий. Мінімально допустима довжина — {0}.',
    [BASE_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR]: 'Пароль занадто довгий. Максимально допустима довжина — {0}.',
    [BASE_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID]: 'Паролі не співпадають.',
}

export {
    UK_BASE_LIBRARY
}