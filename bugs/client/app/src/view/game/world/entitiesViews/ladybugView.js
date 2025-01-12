import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';

class LadybugView extends LiveEntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();
    }

    _renderVisibility() {
        this._entityContainer.renderable = this._entity.isVisible;
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ladybug_4.png`));
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this.$textureManager.getAnimatedTextures(`ladybug`));
        sprite.animationSpeed = 0.2;
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ladybug_dead.png`));
    }
    

}

export {
    LadybugView
}