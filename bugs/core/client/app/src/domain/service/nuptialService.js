class NuptialService {

    constructor(nuptialApi) {
        this._nuptialApi = nuptialApi;
    }

    searchNuptialMales() {
        return this._nuptialApi.searchNuptialMales();
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite) {
        this._nuptialApi.foundColony(queenId, nuptialMaleId, nestBuildingSite);
    }

}

export {
    NuptialService
}