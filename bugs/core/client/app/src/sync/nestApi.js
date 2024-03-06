class NestApi {

    constructor(requester) {
        this._requester = requester;
    }

    addNewEgg(nestId, name, isFertilized) {
        return this._requester.post(`world/nests/${nestId}/add_egg`, {
            name,
            is_fertilized: isFertilized
        });
    }

}

export {
    NestApi
}