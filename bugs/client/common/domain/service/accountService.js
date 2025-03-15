import { BASE_MESSAGE_IDS } from "@common/messages/messageIds";
import { MESSAGE_IDS } from "@messages/messageIds";
import { BaseService } from "./base/baseService";
import { ConflictRequestError } from "../errors/conflictRequestError";

class AccountService extends BaseService {

    static MIN_USERNAME_LENGTH = 4;
    static MAX_USERNAME_LENGTH = 50;
    static USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
    static MIN_PASSWORD_LENGTH = 8;
    static MAX_PASSWORD_LENGTH = 40;
    static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static MIN_EMAIL_LENGTH = 4;
    static MAX_EMAIL_LENGTH = 254;

    static USERNAME_MIN_LENGTH_ERR = Object.freeze({
        msgId: BASE_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR,
        minLength: AccountService.MIN_USERNAME_LENGTH
    });
    static USERNAME_MAX_LENGTH_ERR = Object.freeze({
        msgId: BASE_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR,
        maxLength: AccountService.MAX_USERNAME_LENGTH
    });
    static USERNAME_INVALID_CHARS_ERR = Object.freeze({
        msgId: BASE_MESSAGE_IDS.USERNAME_INVALID_CHARS
    });
    static USERNAME_TAKEN_ERR = Object.freeze({
        msgId: BASE_MESSAGE_IDS.USERNAME_TAKEN
    });
    
    constructor(accountApi, userData) {
        super();
        this._accountApi = accountApi;
        this._userData = userData;
    }

    login(email, password) {
        return this._requestHandler(() => this._accountApi.login(email, password));
    }

    logout() {
        return this._accountApi.logout();
    }

    async register(username, email, password) {
        return this._requestHandler(() => this._accountApi.register(username, email, password));
    }

    resetPasswordRequest(email) {
        return this._requestHandler(() => this._accountApi.resetPasswordRequest(email));
    }

    setNewPassword(newPassword, token, id) {
        return this._requestHandler(() => this._accountApi.setNewPassword(newPassword, token, id));
    }

    async changeUsername(newUsername) {
        let usernameErr = await this.validateUsername(newUsername, false);
        if (usernameErr) {
            return usernameErr;
        }

        try {
            await this._accountApi.changeUsername(newUsername);
            this._userData.username = newUsername;
            return null;
        } catch (error) {
            if (error.status == 409) {
                return AccountService.USERNAME_TAKEN_ERR;
            } else {
                return {
                    msgId: BASE_MESSAGE_IDS.SOMETHING_WENT_WRONG
                }
            }
        }
    }

    async changeEmail(newEmail, password) {
        if (!newEmail) {
            return BASE_MESSAGE_IDS.EMAIL_NEEDED;
        }

        if (!password) {
            return BASE_MESSAGE_IDS.PASSWORD_NEEDED;
        }

        try {
            await this._accountApi.changeEmail(newEmail, password);
            this._userData.email = newEmail;
            return null;
        } catch (error) {
            if (error.status == 401) {
                return BASE_MESSAGE_IDS.PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED;
            } else if (error.status == 400) {
                switch (error.data.err_code) {
                    case 'unique':
                        return BASE_MESSAGE_IDS.EMAIL_TAKEN;
                    case 'invalid_chars':
                    case 'min_length':
                    case 'max_length':
                    case 'blank':
                        return BASE_MESSAGE_IDS.EMAIL_INVALID;
                    default:
                        return BASE_MESSAGE_IDS.SOMETHING_WENT_WRONG;
                }
            } else {
                return BASE_MESSAGE_IDS.SOMETHING_WENT_WRONG;
            }
        }
    }

    getUserData() {
        return this._userData;
    }

    async validateUsername(username = '', checkUniq = true) {
        if (username.length < AccountService.MIN_USERNAME_LENGTH) {
            return AccountService.USERNAME_MIN_LENGTH_ERR;
        }

        if (username.length > AccountService.MAX_USERNAME_LENGTH) {
            return AccountService.USERNAME_MAX_LENGTH_ERR;
        }

        if (!AccountService.USERNAME_REGEX.test(username)) {
            return AccountService.USERNAME_INVALID_CHARS_ERR;
        }

        if (checkUniq) {
            let isUniq = await this._accountApi.checkUsernameUniqueness(username);
            if (!isUniq) {
                return AccountService.USERNAME_TAKEN_ERR;
            }
        }

        return null;
    }

    validatePassword(password = '') {
        if (password.length < AccountService.MIN_PASSWORD_LENGTH) {
            return {
                msgId: MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR,
                minLength: AccountService.MIN_PASSWORD_LENGTH
            }
        }

        if (password.length > AccountService.MAX_PASSWORD_LENGTH) {
            return {
                msgId: MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR,
                maxLength: AccountService.MAX_PASSWORD_LENGTH
            }
        }

        return null;
    }

    async validateEmail(email = '') {
        if (email.length < AccountService.MIN_EMAIL_LENGTH ||
            email.length > AccountService.MAX_EMAIL_LENGTH ||
            !AccountService.EMAIL_REGEX.test(email)
        ) {
            return BASE_MESSAGE_IDS.EMAIL_INVALID;
        }

        let isUniq = await this._accountApi.checkEmailUniqueness(email);
        if (!isUniq) {
            return BASE_MESSAGE_IDS.EMAIL_TAKEN;
        }

        return null;
    }

}

export {
    AccountService
}