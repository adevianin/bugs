class UserApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    login(username, password) {
        return this._requester.post('users/login', {
            username, password
        });
    }

    logout() {
        return this._requester.post('users/logout');
    }

}

export {
    UserApi
}