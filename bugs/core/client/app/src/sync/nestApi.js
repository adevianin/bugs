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

    changeEggCaste(nestId, eggId, antType) {
        return this._requester.post(`world/nests/${nestId}/eggs/${eggId}/change_caste`, {
            ant_type: antType
        });
    }

}

export {
    NestApi
}