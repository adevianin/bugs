class EntityView {
    constructor(entity, spritesheetManager, entityContainer) {
        this._entity = entity;
        this._spritesheetManager = spritesheetManager;
        this._entityContainer = entityContainer;

        this._unbindDiedListener = this._entity.on('died', this.remove.bind(this));
    }

    remove() {
        this._unbindDiedListener();
    }
}

export {
    EntityView
}