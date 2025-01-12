import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class ItemAreaView extends EntityView { 

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._render();
    }

    _render() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFF0000);
        graphics.drawRect(this._entity.position.x, this._entity.position.y, 6, 6);
        graphics.endFill();
        this._entityContainer.addChild(graphics);
    }

}

export {
    ItemAreaView
}