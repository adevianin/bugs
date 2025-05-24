import { COMMON_MESSAGE_IDS } from "../messageIds"

const COMMON_EN_LIBRARY = {
    [COMMON_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR]: 'Minimum length is {0}.',
    [COMMON_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR]: 'Maximum length is {0}.',
    [COMMON_MESSAGE_IDS.USERNAME_INVALID_CHARS]: 'Contains invalid characters.',
    [COMMON_MESSAGE_IDS.USERNAME_TAKEN]: 'This username is already taken.',
    [COMMON_MESSAGE_IDS.USERNAME_NEEDED]: 'Username is empty.',
    [COMMON_MESSAGE_IDS.EMAIL_INVALID]: 'The email address is invalid.',
    [COMMON_MESSAGE_IDS.EMAIL_TAKEN]: 'The email address is already taken.',
    [COMMON_MESSAGE_IDS.EMAIL_NEEDED]: 'The email address is not specified.',
    [COMMON_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR]: 'Minimum length is {0}.',
    [COMMON_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR]: 'Maximum allowed length is {0}.',
    [COMMON_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID]: 'The passwords do not match.',
    [COMMON_MESSAGE_IDS.PASSWORD_NEEDED]: 'Password not provided.',
    [COMMON_MESSAGE_IDS.NOT_VALID_PASSWORD_OR_EMAIL]: 'Incorrect password or email address.',
    [COMMON_MESSAGE_IDS.PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED]: 'The entered password is incorrect. The email has not been changed.',
    [COMMON_MESSAGE_IDS.OLD_PASSWORD_IS_NOT_VALID_PASSWORD_NOT_CHANGED]: 'The entered old password is incorrect. The password has not been changed.',
    [COMMON_MESSAGE_IDS.RESET_PASSWORD_LINK_EXPIRED]: 'The password reset link is invalid or expired. Please request a new link.',
    [COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG]: 'Something went wrong.',
}

export {
    COMMON_EN_LIBRARY
}