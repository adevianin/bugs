import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class FoodView extends EntityView { 

    constructor(entity, spritesheetManager, entityContainer) {
        super(entity, spritesheetManager, entityContainer);

        this._sprite = new PIXI.Sprite(spritesheetManager.getTexture('food.png'));
        entityContainer.addChild(this._sprite);

        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._sprite);
    }

}

export {
    FoodView
}