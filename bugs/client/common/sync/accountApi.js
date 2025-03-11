class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    login(email, password) {
        return this._requester.post('api/accounts/login', {
            email, password
        });
    }

    logout() {
        return this._requester.post('api/accounts/logout').then(res => {
            return res.data.redirectUrl;
        });
    }

    register(username, email, password) {
        return this._requester.post('api/accounts/register', {
            username, email, password
        });
    }

    checkUsernameUniqueness(username) {
        return this._requester.post('api/accounts/check_username_uniqueness', {
            username
        }).then(res => {
            return res.data.is_unique;
        });
    }

    checkEmailUniqueness(email) {
        return this._requester.post('api/accounts/check_email_uniqueness', {
            email
        }).then(res => {
            return res.data.is_unique;
        });
    }

}

export {
    AccountApi
}