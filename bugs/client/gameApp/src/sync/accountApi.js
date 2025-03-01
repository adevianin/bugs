class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    logout() {
        return this._requester.post('api/accounts/logout').then(res => {
            return res.data.redirectUrl;
        });
    }

}

export {
    AccountApi
}