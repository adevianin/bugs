import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class BugView extends EntityView {

    constructor(entity, spritesheetManager, entityContainer) {
        super(entity, spritesheetManager, entityContainer);

        this._sprite = new PIXI.Sprite(spritesheetManager.getTexture('bug1.png'));
        entityContainer.addChild(this._sprite);
        
        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
        this._entity.on('onFoodLift', this._onFoodLift.bind(this));
        this._entity.on('onFoodDrop', this._onFoodDrop.bind(this));
    }

    _render() {
        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
        if (this._pickedFoodSprite) {
            this._pickedFoodSprite.x = this._entity.position.x;
            this._pickedFoodSprite.y = this._entity.position.y - 20;
        }
    }

    _onFoodLift() {
        this._pickedFoodSprite = new PIXI.Sprite(this._spritesheetManager.getTexture('food.png'));
        this._entityContainer.addChild(this._pickedFoodSprite);
        this._render();
    }

    _onFoodDrop() {
        this._entityContainer.removeChild(this._pickedFoodSprite);
        this._pickedFoodSprite = null;
        this._render();
    }
}

export {
    BugView
}