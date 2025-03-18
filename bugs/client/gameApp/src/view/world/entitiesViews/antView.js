import * as PIXI from 'pixi.js';
import { PickedItemView } from './pickedItemView';
import { LiveEntityView } from './liveEntityView';

class AntView extends LiveEntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindItemPickedUpListener = this._entity.on('itemPickedUp', this._renderPickedItemView.bind(this));
        this._unbindItemDropListener = this._entity.on('itemDroped', this._removePickedItemView.bind(this));
        this._unbindLocatedInNestChangedListener = this._entity.on('locatedInNestChanged', this._renderVisibility.bind(this));
        this._unbindIsInNuptialFlightChangedListener = this._entity.on('isInNuptialFlightChanged', this._renderVisibility.bind(this));
    }

    remove() {
        super.remove();
        this._unbindItemPickedUpListener();
        this._unbindItemDropListener();
        this._unbindLocatedInNestChangedListener();
        this._unbindIsInNuptialFlightChangedListener();
        this._removePickedItemView();
    }

    _render() {
        super._render();

        if (this._entity.hasPickedItem()) { 
            this._renderPickedItemView();
        }

        // this._renderDebugSightDistance();
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_4.png`));
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}`));
        sprite.animationSpeed = 0.2;
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_dead.png`));
    }

    _removePickedItemView() {
        if (this._pickedItemView) {
            this._pickedItemView.remove();
            this._pickedItemView = null;
        }
    }

    _renderPickedItemView() {
        if (!this._pickedItemView) {
            let item = this.$domain.findEntityById(this._entity.pickedItemId);
            this._pickedItemView = new PickedItemView(item, this._pickedItemContainer);
        }
    }

    _renderDebugSightDistance() {
        let sightDistance = this._entity.stats.sightDistance;
        let graphics = new PIXI.Graphics();
        graphics.circle(0, 0, sightDistance).stroke({width: 1, color: 0xFF0000});
        graphics.rect(-sightDistance, -sightDistance, 2*sightDistance, 2*sightDistance).stroke({width: 1, color: 0x00FF00});
        this._entityContainer.addChild(graphics);
    }

}

export {
    AntView
}