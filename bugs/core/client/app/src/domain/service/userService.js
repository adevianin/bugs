class UserService {
    
    constructor(userApi, userData) {
        this._userApi = userApi;
        this._userData = userData;
    }

    login(username, password) {
        return this._userApi.login(username, password)
            .then(userData => {
                this._userData = userData;
            });
    }

    register(username, password) {
        return this._userApi.register(username, password)
            .then(userData => {
                this._userData = userData;
            });
    }

    logout() {
        return this._userApi.logout().then(() => {
            this._userData = null;
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

}

export {
    UserService
}