class ColonyService {

    constructor(colonyApi) {
        this._colonyApi = colonyApi;
    }

    buildNewNest(position) {
        this._colonyApi.buildNewNest(position);
    }

    updateMyColony(colonyJson) {
        console.log('new colony', colonyJson);
    }
}

export {
    ColonyService
}