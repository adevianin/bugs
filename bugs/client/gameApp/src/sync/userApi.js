class UserApi {

    constructor(requester) {
        this._requester = requester;
    }

    bornNewAntara() {
        return this._requester.post(`api/world/player/born_new_antara`);
    }

}

export {
    UserApi
}