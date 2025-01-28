class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    logout() {
        return this._requester.post('api/accounts/logout').then((resp) => {
            return resp.data.redirectUrl;
        });
    }

}

export {
    AccountApi
}