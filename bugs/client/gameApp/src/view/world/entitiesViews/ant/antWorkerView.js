import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { BaseAntView } from "./baseAntView";
import { ItemTypes } from '@domain/enum/itemTypes';

class AntWorkerView extends BaseAntView {

    static ANIMATION_TYPES = class extends BaseAntView.ANIMATION_TYPES {
        static PICKED_UP_ITEM = 'picked_up_item';
        static DROPPED_ITEM = 'dropped_item';
    }

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        this._render();

        let antId = this._entity.id;
        this._stopListenAntPickedUpItemAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ANT_PICKED_UP_ITEM}`, this._onAntPickedUpItemAnimationRequest.bind(this));
        this._stopListenAntDroppedItemAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ANT_DROPPED_PICKED_ITEM}`, this._onAntDroppedItemAnimationRequest.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenAntPickedUpItemAR();
        this._stopListenAntDroppedItemAR();
    }

    _buildStandSprite() {
        let sprite = new PIXI.Sprite(this._standTextureEmpty);
        return sprite;
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this._walkTexturesEmpty);
        sprite.animationSpeed = this._calcWalkAnimationSpeed();
        return sprite;
    }

    _buildDeadSprite() {
        return super._buildDeadSprite();
    }

    _buildFlySprite() {
        return null;
    }

    _prepareTextures() {
        this._standTextureFull = this.$textureManager.getTexture(`ant_${this.entity.antType}_full_1.png`);
        let walkTexturesFull = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}_full`);
        this._walkTexturesFull = [walkTexturesFull[0], walkTexturesFull[1], walkTexturesFull[0], walkTexturesFull[2]];
        this._standTextureEmpty = this.$textureManager.getTexture(`ant_${this.entity.antType}_empty_1.png`);
        let walkTexturesEmpty = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}_empty`);
        this._walkTexturesEmpty = [walkTexturesEmpty[0], walkTexturesEmpty[1], walkTexturesEmpty[0], walkTexturesEmpty[2]];
    }

    _renderEntityState() {
        super._renderEntityState();
        this._renderPickedItemState();
    }

    async _renderPickedItemState() {
        if (this._entity.pickedItemId) {
            let item = await this.$domain.getEntityDataById(this._entity.pickedItemId);
            this._renderPickedItem(item);
        }
    }

    _playAnimation(animation) {
        let resp = super._playAnimation(animation);
        if (resp.isPlayed) {
            return resp;
        }

        switch (animation.type) {
            case AntWorkerView.ANIMATION_TYPES.PICKED_UP_ITEM: 
                let pickUpAnimPromise = this._playPickedUpItemAnimation(animation.params);
                return this._makePlayAnimationResponse(true, pickUpAnimPromise);
            case AntWorkerView.ANIMATION_TYPES.DROPPED_ITEM: 
                this._playDroppedItemAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    async _playPickedUpItemAnimation({ itemId }) {
        let item = await this.$domain.getEntityDataById(itemId)
        this._renderPickedItem(item);
    }

    _playDroppedItemAnimation({ droppingItemId }) {
        let dropPosition = {
            x: this._entityContainer.x,
            y: this._entityContainer.y
        }
        if (this.checkIsEntityVisible()) {
            this.$eventBus.emit(`interEntityAnimationRequest:${droppingItemId}:itemWasDropped`, {
                dropPosition
            });
        }
        this._removePickedItem();
    }

    _removePickedItem() {
        this._renderIsBodyFullState(false);
        if (this._pickedItemSprite) {
            this._pickedItemContainer.removeChild(this._pickedItemSprite);
            this._pickedItemSprite.destroy();
            this._pickedItemSprite = null;
        }
    }

    _renderPickedItem(item) {
        this._removePickedItem();
        if (item.itemType == ItemTypes.NECTAR || item.itemType == ItemTypes.HONEYDEW) {
            this._renderIsBodyFullState(true);
        } else {
            let textureName = `item_${ item.itemType }_${ item.itemVariety }v.png`;
            this._pickedItemSprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
            this._pickedItemSprite.anchor.set(0.5, 0.5);
            this._pickedItemSprite.position.x = (this._entityWidth/2);
            this._pickedItemSprite.position.y = 2;
            this._pickedItemContainer.addChild(this._pickedItemSprite);
        }
    }

    _renderIsBodyFullState(isFull) {
        this._walkSprite.textures = isFull ? this._walkTexturesFull : this._walkTexturesEmpty;
        this._standSprite.texture = isFull ? this._standTextureFull : this._standTextureEmpty;
    }

    _onAntPickedUpItemAnimationRequest(params) {
        this._addAnimation(AntWorkerView.ANIMATION_TYPES.PICKED_UP_ITEM, params);
    }

    _onAntDroppedItemAnimationRequest(params) {
        this._addAnimation(AntWorkerView.ANIMATION_TYPES.DROPPED_ITEM, params);
    }
}

export {
    AntWorkerView
}