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
            default:
                let colony = this._world.findColonyById(action.actorId);
                colony.playAction(action);
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

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount) {
        this._colonyApi.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount);
    }

    destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest) {
        this._colonyApi.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest);
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        this._colonyApi.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
    }

    transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        this._colonyApi.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
    }

    buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        this._colonyApi.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
    }

    bringBugOpearation(performingColonyId, nestId) {
        this._colonyApi.bringBugOpearation(performingColonyId, nestId);
    }

}

export {
    ColonyService
}