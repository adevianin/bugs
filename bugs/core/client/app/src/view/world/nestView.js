import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class NestView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture('nest.png'));
        this._sprite.anchor.set(0.5);
        entityContainer.addChild(this._sprite);

        this._sprite.eventMode = 'static';

        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;

        if (this.$domainFacade.isNestMine(entity)) {
            this._sprite.on('pointerdown', this._onClick.bind(this));
        }
        
    }

    remove() {
        super.remove();
    }

    _onClick() {
        NestView.popupManager.openNestPopup(this._entity);
    }

}

export {
    NestView
}