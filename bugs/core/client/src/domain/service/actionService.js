class ActionService {

    constructor(actionFactory, world) {
        this._actionFactory = actionFactory;
        this._world = world;
    }

    playAction(actionJson) {
        let action = this._actionFactory.buildAction(actionJson);
        let entity = this._world.findEntityById(action.entityId);
        entity.addAction(action);
    }
}

export {
    ActionService
}