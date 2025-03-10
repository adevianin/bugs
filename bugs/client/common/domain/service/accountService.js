import { BASE_MESSAGE_IDS } from "@common/messages/messageIds";
import { MESSAGE_IDS } from "@messages/messageIds";
import { BaseService } from "./base/baseService";

class AccountService extends BaseService {

    static MIN_USERNAME_LENGTH = 4;
    static MAX_USERNAME_LENGTH = 50;
    static USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
    static MIN_PASSWORD_LENGTH = 8;
    static MAX_PASSWORD_LENGTH = 40;
    
    constructor(accountApi, userData) {
        super();
        this._accountApi = accountApi;
        this._userData = userData;
    }

    logout() {
        return this._accountApi.logout();
    }

    async register(username, email, password) {
        return this._requestHandler(() => this._accountApi.register(username, email, password));
    }

    getUserData() {
        return this._userData;
    }

    async validateUsername(username = '') {
        if (username.length < AccountService.MIN_USERNAME_LENGTH) {
            return {
                msgId: BASE_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR,
                minLength: AccountService.MIN_USERNAME_LENGTH
            }
        }

        if (username.length > AccountService.MAX_USERNAME_LENGTH) {
            return {
                msgId: BASE_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR,
                maxLength: AccountService.MAX_USERNAME_LENGTH
            }
        }

        if (!AccountService.USERNAME_REGEX.test(username)) {
            return {
                msgId: BASE_MESSAGE_IDS.USERNAME_INVALID_CHARS
            }
        }

        let isUniq = await this._accountApi.checkUsernameUniqueness(username);
        if (!isUniq) {
            return {
                msgId: BASE_MESSAGE_IDS.USERNAME_TAKEN
            }
        }

        return null;
    }

    async checkEmailUniqueness(email) {
        return await this._accountApi.checkEmailUniqueness(email);
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

}

export {
    AccountService
}