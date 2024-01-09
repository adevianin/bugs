class NestApi {

    constructor(requester) {
        this._requester = requester;
    }

    addNewLarva(nestId, larvaType) {
        return this._requester.post(`world/nests/${nestId}/add_larva`, {
            larva_type: larvaType
        });
    }

}

export {
    NestApi
}