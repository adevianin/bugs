class ColonyService {

    constructor(colonyApi, world, worldFactory, mainEventBus) {
        this._mainEventBus = mainEventBus;
        this._colonyApi = colonyApi;
        this._world = world;
        this._worldFactory = worldFactory;
    }

    giveBirthToColony(colonyJson) {
        let colony = this._worldFactory.buildColony(colonyJson.id, colonyJson.owner_id, colonyJson.operations);
        this._world.addColony(colony);
        this._mainEventBus.emit('colonyBorn', colony);
    }

    stopMyColonyOperation(operationId) {
        this._colonyApi.stopMyColonyOperation(operationId);
    }

    buildNewNest(position) {
        this._colonyApi.buildNewNest(position);
    }

    destroyNestOperation(nest) {
        this._colonyApi.destroyNestOperation(nest);
    }

    pillageNestOperation(pillagingNest, unloadingNest) {
        this._colonyApi.pillageNestOperation(pillagingNest, unloadingNest);
    }

}

export {
    ColonyService
}