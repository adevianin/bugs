import { BASE_MESSAGE_IDS } from "../messageIds"

const EN_BASE_LIBRARY = {
    [BASE_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR]: 'Username is too short. The minimum allowed length is {0}.',
    [BASE_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR]: 'Username is too long. The maximum allowed length is {0}.',
    [BASE_MESSAGE_IDS.USERNAME_INVALID_CHARS]: 'Username contains invalid characters.',
    [BASE_MESSAGE_IDS.USERNAME_TAKEN]: 'This username is already taken.',
    [BASE_MESSAGE_IDS.EMAIL_INVALID]: 'The email address is invalid.',
    [BASE_MESSAGE_IDS.EMAIL_TAKEN]: 'The email address is already taken.',
    [BASE_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR]: 'Password is too short. The minimum allowed length is {0}.',
    [BASE_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR]: 'Password is too long. The maximum allowed length is {0}.',
    [BASE_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID]: '"The passwords do not match.',
    [BASE_MESSAGE_IDS.PASSWORD_NEEDED]: 'Password not provided.',
    [BASE_MESSAGE_IDS.NOT_VALID_PASSWORD_OR_EMAIL]: 'Incorrect password or email address.',
    [BASE_MESSAGE_IDS.SOMETHING_WENT_WRONG]: 'Something went wrong.',
}

export {
    EN_BASE_LIBRARY
}