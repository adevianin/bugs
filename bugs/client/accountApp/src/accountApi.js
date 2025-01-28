class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    login(username, password) {
        return this._requester.post('api/accounts/login', {
            username, password
        }).then((response) => {
            return response.data.user;
        });
    }

    register(username, password) {
        return this._requester.post('api/accounts/register', {
            username, password
        }).then((response) => {
            return response.data.user;
        });
    }

    checkUsernameUnique(username) {
        return this._requester.post('api/accounts/check_name', {
            username
        }).then((res) => {
            return res.data.is_unique;
        });
    }

}

export {
    AccountApi
}