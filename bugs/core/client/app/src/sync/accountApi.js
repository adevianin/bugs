class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    login(username, password) {
        return this._requester.post('users/login', {
            username, password
        }).then((response) => {
            return response.data.user;
        });
    }

    register(username, password) {
        return this._requester.post('users', {
            username, password
        }).then((response) => {
            return response.data.user;
        });
    }

    logout() {
        return this._requester.post('users/logout');
    }

    checkUsernameUnique(username) {
        return this._requester.post('users/username_unique_check', {
            username
        }).then((res) => {
            return res.data.is_unique;
        });
    }

}

export {
    AccountApi
}