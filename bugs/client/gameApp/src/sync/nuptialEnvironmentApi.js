class NuptialEnvironmentApi {

    constructor(requester) {
        this._requester = requester;
    }

    saveSpecieSchema(specie) {
        this._requester.post('api/world/nuptial_environment/specie/specie_schema', {
            specie_schema: specie.schema
        });
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        return new Promise((res, rej) => {
            this._requester.post('api/world/nuptial_environment/found_colony', {
                queen_id: queenId,
                nuptial_male_id: nuptialMaleId,
                nest_building_site: [nestBuildingSite.x, nestBuildingSite.y],
                colony_name: colonyName
            })
            .then(axiosResp => res(null))
            .catch(axiosResp => rej(axiosResp.response.data))
        });
    }
    
}

export {
    NuptialEnvironmentApi
}