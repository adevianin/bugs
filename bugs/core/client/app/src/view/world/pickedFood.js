import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class PickedFoodView extends EntityView { 

    constructor(entity, position, entityContainer) {
        super(entity, entityContainer);
        this._position = position;

        let textureName = `food_${this._entity.food_type}_${this._entity.food_variety}v.png`;
        if (entity.food_type == 'nectar') {
            textureName = 'food_nectar_picked.png';
        }
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        this._sprite.anchor.set(0.5);
        entityContainer.addChild(this._sprite);

        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
    }

    setPosition(position) {
        this._position = position;
        this._renderPosition();
    }

    _render() {
        this._renderPosition();
    }

    _renderPosition() {
        this._sprite.x = this._position.x;
        this._sprite.y = this._position.y;
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

}

export {
    PickedFoodView
}