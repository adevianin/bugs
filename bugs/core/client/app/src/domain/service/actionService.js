class ActionService {

    constructor(stepTime, actionFactory, worldService, colonyService) {
        this._actionFactory = actionFactory;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._actionsJson = [];
        this._currentStep = null;
        this._stepTime = stepTime;
    }

    playAction(actionJson) {
        let action = this._actionFactory.buildAction(actionJson);
        
        switch(action.actorType) {
            case 'entity':
                this._playEntityAction(action);
                break;
            case 'colony':
                this._playColonyAction(action);
                break;
        }
    }

    _playEntityAction(action) {
        switch(action.type) {
            case 'entity_born':
                this._worldService.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this._worldService.world.findEntityById(action.actorId);
                actor.addAction(action);
        }
    }

    _playColonyAction(action) {
        switch(action.type) {
            case 'colony_born':
                this._colonyService.giveBirthToColony(action.actionData.colony);
                break;
            case 'colony_operations_change':
                let colony = this._worldService.world.findColonyById(action.actorId);
                colony.setOperations(action.actionData.operations);
                break;
            default:
                throw 'unknown type of colony action'
        }
    }

}

export {
    ActionService
}