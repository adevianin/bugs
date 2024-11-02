class UserApi {

    constructor(requester) {
        this._requester = requester;
    }

    prepareStarterPack() {
        return this._requester.post(`world/player/prepare_starter_pack`);
    }

}

export {
    UserApi
}