import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';

class LadybugView extends LiveEntityView {

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        this._render();
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ladybug_1.png`));
    }

    _buildWalkSprite() {
        let ts = this.$textureManager.getAnimatedTextures(`ladybug`);
        let sprite = new PIXI.AnimatedSprite([ts[0], ts[1], ts[0], ts[2]]);
        sprite.animationSpeed = 0.16;
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ladybug_dead.png`));
    }
    

}

export {
    LadybugView
}