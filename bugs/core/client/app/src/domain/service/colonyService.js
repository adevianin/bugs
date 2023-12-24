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

    stopOperation(colonyId, operationId) {
        this._colonyApi.stopOperation(colonyId, operationId);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount) {
        this._colonyApi.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount);
    }

    destroyNestOperation(performingColonyId, warriorsCount, nest) {
        this._colonyApi.destroyNestOperation(performingColonyId, warriorsCount, nest);
    }

    pillageNestOperation(performingColonyId, pillagingNest, nestForLoot, warriorsCount, workersCount) {
        this._colonyApi.pillageNestOperation(performingColonyId, pillagingNest, nestForLoot, warriorsCount, workersCount);
    }

}

export {
    ColonyService
}