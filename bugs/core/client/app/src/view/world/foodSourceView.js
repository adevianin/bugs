import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class FoodSourceView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();
    }

    _render() {
        this._foodSourceContainer = new PIXI.Container();
        this._entityContainer.addChild(this._foodSourceContainer);
        
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`food_source_${this._entity.foodType}.png`));
        this._sprite.anchor.set(0.5, 1);
        this._foodSourceContainer.addChild(this._sprite);

        this._foodSourceContainer.x = this._entity.position.x;
        this._foodSourceContainer.y = this._entity.position.y;
    }

    remove() {
        super.remove();
    }
}

export {
    FoodSourceView
}