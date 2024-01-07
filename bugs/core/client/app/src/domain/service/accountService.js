class AccountService {
    
    constructor(accountApi, userData, mainEventBus) {
        this._accountApi = accountApi;
        this._userData = userData;
        this._mainEventBus = mainEventBus;
    }

    login(username, password) {
        return this._accountApi.login(username, password)
            .then(userData => {
                this._userData = userData;
                this._emitStatusChange();
            });
    }

    register(username, password) {
        return this._accountApi.register(username, password)
            .then(userData => {
                this._userData = userData;
                this._emitStatusChange();
            });
    }

    logout() {
        return this._accountApi.logout().then(() => {
            this._userData = null;
            this._emitStatusChange();
        });
    }

    checkUsernameUnique(username) {
        return this._accountApi.checkUsernameUnique(username);
    }

    isLoggedIn() {
        return !!this._userData;
    }

    getUserData() {
        return this._userData;
    }

    _emitStatusChange() {
        this._mainEventBus.emit('loginStatusChanged', this.isLoggedIn());
    }

}

export {
    AccountService
}