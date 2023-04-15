import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class TownView extends EntityView { 

    constructor(entity, spritesheetManager, entityContainer) {
        super(entity, spritesheetManager, entityContainer);

        this._sprite = new PIXI.Sprite(spritesheetManager.getTexture('town.png'));
        entityContainer.addChild(this._sprite);

        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
    }

}

export {
    TownView
}