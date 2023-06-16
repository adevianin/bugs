import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class FoodView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        let textureName = `food_${this._entity.food_type}_${this._entity.food_variety}v.png`;
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        entityContainer.addChild(this._sprite);
        this._sprite.anchor.set(0.5);

        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;

        this._unbindFoodPickedUpListener = this._entity.on('food_picked_up', this._onFoodPickedUp.bind(this));
    }

    remove() {
        this._unbindFoodPickedUpListener();
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

    _onFoodPickedUp() {
        this.remove();
    }

}

export {
    FoodView
}