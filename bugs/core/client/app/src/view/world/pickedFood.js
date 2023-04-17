import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class PickedFoodView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        let textureName = `food_${this._entity.food_type}_${this._entity.food_variety}v.png`;
        if (entity.food_type == 'nectar') {
            textureName = 'food_nectar_picked.png';
        }
        this._sprite = new PIXI.Sprite(PickedFoodView.textureManager.getTexture(textureName));
        entityContainer.addChild(this._sprite);
        this._sprite.anchor.set(0.5);

        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
    }

    _render() {
        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

}

export {
    PickedFoodView
}