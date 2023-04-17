import { BaseView } from "./baseView";

class EntityView extends BaseView {
    constructor(entity, entityContainer) {
        super();
        this._entity = entity;
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