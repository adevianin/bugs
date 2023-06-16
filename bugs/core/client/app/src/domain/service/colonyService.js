class ColonyService {

    constructor(colonyApi) {
        this._colonyApi = colonyApi;
    }

    stopMyColonyOperation(operationId) {
        this._colonyApi.stopMyColonyOperation(operationId);
    }

    buildNewNest(position) {
        this._colonyApi.buildNewNest(position);
    }

}

export {
    ColonyService
}