import { BaseGraphicView } from "./base/baseGraphicView";
import * as PIXI from 'pixi.js';

class EntityView extends BaseGraphicView {
    constructor(entity, entitiesContainer) {
        super();
        this._entity = entity;
        this._parentContainer = entitiesContainer;
        this._entityContainer = new PIXI.Container();
        this._parentContainer.addChild(this._entityContainer);

        this._unbindDiedListener = this._entity.on('died', this.remove.bind(this));
    }

    get entity() {
        return this._entity;
    }

    remove() {
        this._parentContainer.removeChild(this._entityContainer);
        this._unbindDiedListener();
    }
    
}

export {
    EntityView
}