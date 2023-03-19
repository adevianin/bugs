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