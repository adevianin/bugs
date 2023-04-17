import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class TownView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._sprite = new PIXI.Sprite(TownView.textureManager.getTexture('town.png'));
        this._sprite.anchor.set(0.5);
        entityContainer.addChild(this._sprite);

        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
    }

}

export {
    TownView
}