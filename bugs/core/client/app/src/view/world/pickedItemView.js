import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class PickedItemView extends EntityView { 

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        let textureName = `item_${ this._entity.itemType }_${ this._entity.itemVariety }v.png`;
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        this._entityContainer.addChild(this._sprite);

        this._render();
    }

    _render() {
        this._sprite.x = 0;
        this._sprite.y = -14;
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

}

export {
    PickedItemView
}