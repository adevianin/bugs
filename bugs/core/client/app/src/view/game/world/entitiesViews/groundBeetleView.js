import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';

class GroundBeetleView extends LiveEntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ground_beetle_4.png`));
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this.$textureManager.getAnimatedTextures(`ground_beetle`));
        sprite.animationSpeed = 0.2;
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ground_beetle_dead.png`));
    }
    

}

export {
    GroundBeetleView
}