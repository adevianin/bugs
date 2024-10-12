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

    changeEggName(nestId, eggId, name) {
        return this._requester.post(`world/nests/${nestId}/eggs/${eggId}/change_name`, {
            name: name
        });
    }

    eggToLarvaChamber(nestId, eggId) {
        return this._requester.post(`world/nests/${nestId}/eggs/${eggId}/move_to_larva_chamber`);
    }

    eggDelete(nestId, eggId) {
        return this._requester.post(`world/nests/${nestId}/eggs/${eggId}/delete`);
    }

    larvaDelete(nestId, larvaId) {
        return this._requester.post(`world/nests/${nestId}/larvae/${larvaId}/delete`);
    }

}

export {
    NestApi
}