class ColonyService {

    constructor(colonyApi, world, worldFactory, mainEventBus) {
        this._mainEventBus = mainEventBus;
        this._colonyApi = colonyApi;
        this._world = world;
        this._worldFactory = worldFactory;
    }

    playColonyAction(action) {
        switch(action.type) {
            case 'colony_born':
                this.giveBirthToColony(action.actionData.colony);
                break;
            case 'colony_operations_change':
                let colony = this._world.findColonyById(action.actorId);
                colony.setOperations(action.actionData.operations);
                break;
            default:
                throw 'unknown type of colony action'
        }
    }

    giveBirthToColony(colonyJson) {
        let colony = this._worldFactory.buildAntColony(colonyJson.id, colonyJson.owner_id, colonyJson.operations);
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

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        this._colonyApi.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
    }

}

export {
    ColonyService
}