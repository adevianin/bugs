class NuptialApi {

    constructor(requester) {
        this._requester = requester;
    }

    searchNuptialMales() {
        return this._requester.get('world/nuptial_environment/search_nuptial_males').then((response) => {
            return response.data.nuptial_males;
        })
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite) { 
        return this._requester.post('world/nuptial_environment/found_colony', {
            queen_id: queenId,
            nuptial_male_id: nuptialMaleId,
            nest_building_site: [nestBuildingSite.x, nestBuildingSite.y]
        })
    }

}

export {
    NuptialApi
}