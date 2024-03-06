class NuptialService {

    constructor(nuptialApi, worldFactory) {
        this._nuptialApi = nuptialApi;
        this._worldFactory = worldFactory;
    }

    searchNuptialMales() {
        return this._nuptialApi.searchNuptialMales().then((malesJson) => {
            let males = [];
            for (let maleJson of malesJson) {
                let male = this._worldFactory.buildNuptialMale(maleJson);
                males.push(male);
            }

            return males;
        });
        
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite) {
        this._nuptialApi.foundColony(queenId, nuptialMaleId, nestBuildingSite);
    }

}

export {
    NuptialService
}