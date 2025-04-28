class NuptialEnvironmentApi {

    constructor(requester) {
        this._requester = requester;
    }

    saveSpecieSchema(specieSchema) {
        this._requester.post('/api/world/nuptial_environment/specie/specie_schema', {
            specie_schema: specieSchema
        });
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        return this._requester.post('/api/world/nuptial_environment/found_colony', {
            queen_id: queenId,
            nuptial_male_id: nuptialMaleId,
            nest_building_site: [nestBuildingSite.x, nestBuildingSite.y],
            colony_name: colonyName
        });
    }

    bornNewAntara() {
        return this._requester.post(`/api/world/nuptial_environment/born_new_antara`);
    }
    
}

export {
    NuptialEnvironmentApi
}