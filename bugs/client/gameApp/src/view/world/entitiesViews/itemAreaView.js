import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { VIEW_SETTINGS } from '@view/viewSettings';

class ItemAreaView extends EntityView { 

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._render();
    }

    remove() {
        super.remove();
    }

    _render() {
        if (VIEW_SETTINGS.showItemAreaDot) {
            this._renderDot();
        }
    }

    _renderDot() {
        const graphics = new PIXI.Graphics();
        graphics.fill(0xFF0000);
        graphics.rect(this._entity.position.x, this._entity.position.y, 6, 6);
        graphics.fill();
        this._entityContainer.addChild(graphics);
    }

}

export {
    ItemAreaView
}