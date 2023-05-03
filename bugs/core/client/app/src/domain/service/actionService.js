class ActionService {

    constructor(actionFactory, world) {
        this._actionFactory = actionFactory;
        this._world = world;
    }

    playActions(actionsJson) {
        actionsJson.forEach(actionJson => {
            this._playAction(actionJson);
        });
    }

    _playAction(actionJson) {
        let action = this._actionFactory.buildAction(actionJson);
        let entity = this._world.findEntityById(action.entityId);
        entity.addAction(action);
    }
}

export {
    ActionService
}