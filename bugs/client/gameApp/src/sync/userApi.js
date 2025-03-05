class UserApi {

    constructor(requester) {
        this._requester = requester;
    }

    bornNewAntara() {
        return this._requester.post(`api/world/nuptial_environment/born_new_antara`);
    }

}

export {
    UserApi
}