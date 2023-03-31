class UserService {
    
    constructor(userApi, userData) {
        this._userApi = userApi;
        this._userData = userData;
    }

    login(username, password) {
        return this._userApi.login(username, password)
            .then(response => {
                this._userData = response.data.user;
            });
    }

    logout() {
        return this._userApi.logout().then(() => {
            this._userData = null;
        });
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