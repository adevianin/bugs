class UserService {
    
    constructor(userApi, userData, mainEventBus) {
        this._userApi = userApi;
        this._userData = userData;
        this._mainEventBus = mainEventBus;
    }

    login(username, password) {
        return this._userApi.login(username, password)
            .then(userData => {
                this._userData = userData;
                this._emitStatusChange();
            });
    }

    register(username, password) {
        return this._userApi.register(username, password)
            .then(userData => {
                this._userData = userData;
                this._emitStatusChange();
            });
    }

    logout() {
        return this._userApi.logout().then(() => {
            this._userData = null;
            this._emitStatusChange();
        });
    }

    checkUsernameUnique(username) {
        return this._userApi.checkUsernameUnique(username);
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
    UserService
}