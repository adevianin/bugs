class AccountService {
    
    constructor(accountApi, userData) {
        this._accountApi = accountApi;
        this._userData = userData;
    }

    logout() {
        return this._accountApi.logout();
    }

    getUserData() {
        return this._userData;
    }

}

export {
    AccountService
}