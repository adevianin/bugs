class ActionService {

    constructor(actionFactory, worldService) {
        this._actionFactory = actionFactory;
        this._worldService = worldService;
    }

    handleActions(actionsJson) {
        actionsJson.forEach(actionJson => {
            let action = this._actionFactory.buildAction(actionJson);
            this._handleAction(action);
        });
    }

    _handleAction(action) {
        switch(action.type) {
            case 'entity_born':
                this._worldService.giveBirthToEntity(action.additionalData.entityJson)
                break;
            default:
                let actor = this._worldService.world.findEntityById(action.entityId);
                actor.addAction(action);
        }
    }
}

export {
    ActionService
}