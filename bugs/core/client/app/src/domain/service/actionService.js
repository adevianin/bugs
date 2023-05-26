class ActionService {

    constructor(stepTime, actionFactory, worldService) {
        this._actionFactory = actionFactory;
        this._worldService = worldService;
        this._actionsJson = [];
        this._currentStep = null;
        this._stepTime = stepTime;
    }

    playAction(actionJson) {
        let action = this._actionFactory.buildAction(actionJson);

        switch(action.type) {
            case 'entity_born':
                this._worldService.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this._worldService.world.findEntityById(action.actorId);
                actor.addAction(action);
        }
    }

}

export {
    ActionService
}