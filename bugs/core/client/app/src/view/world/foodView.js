import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class FoodView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render(entityContainer);

        this._unbindFoodPickedUpListener = this._entity.on('isPickedChanged', this._renderIsPicked.bind(this));
        this._unbindPosChangedListener = this._entity.on('positionChanged', this._renderPosition.bind(this));
    }

    _render(entityContainer) {
        let textureName = `food_${this._entity.food_type}_${this._entity.food_variety}v.png`;
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        this._sprite.anchor.set(0.5);
        entityContainer.addChild(this._sprite);
        
        this._renderPosition();
        this._renderIsPicked();
    }

    remove() {
        this._unbindFoodPickedUpListener();
        this._unbindPosChangedListener();
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

    _renderIsPicked() {
        this._sprite.renderable = !this._entity.is_picked;
    }

    _renderPosition() {
        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
    }

}

export {
    FoodView
}