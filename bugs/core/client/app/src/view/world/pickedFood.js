import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class PickedFoodView extends EntityView { 

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        let textureName = `food_${this._entity.food_type}_${this._entity.food_variety}v.png`;
        if (entity.food_type == 'nectar') {
            textureName = 'food_nectar_picked.png';
        }
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        this._entityContainer.addChild(this._sprite);

        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
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
    PickedFoodView
}