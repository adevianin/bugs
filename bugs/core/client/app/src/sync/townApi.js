class TownApi {

    constructor(requester) {
        this._requester = requester;
    }

    addNewLarva(townId, larvaType) {
        return this._requester.post(`world/towns/${ townId }/add_larva`, {
            larvaType
        });
    }
}

export {
    TownApi
}