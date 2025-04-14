import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { distance_point } from '@utils/distance';
import { interpolatePoint } from '@utils/interpolatePoint';

class ItemView extends EntityView {

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static PICKED = 'picked';
        static DROPPED = 'dropped';
        static BE_BRINGED = 'be_bringed';
    };

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._stopListenPickedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_WAS_PICKED_UP}`, this._onPickedAnimationRequest.bind(this));
        this._stopListenDroppedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_WAS_DROPPED}`, this._onDroppedAnimationRequest.bind(this));
        this._stopListenBeingBringedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_BEING_BRINGED}`, this._onBeingBringedAnimationRequest.bind(this));

        this._render();
    }

    remove() {
        this._stopListenPickedAnimationRequest();
        this._stopListenDroppedAnimationRequest();
        this._stopListenBeingBringedAnimationRequest();
        super.remove();
    }

    _render() {
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_${ this._entity.itemType }_${ this._entity.itemVariety }v.png`));
        this._entityContainer.addChild(this._sprite);

        let halfWidth = this._sprite.width / 2;
        let halfHeight = this._sprite.height / 2;

        this._entityContainer.pivot.x = halfWidth;
        this._entityContainer.pivot.y = halfHeight;

        this._renderEntityState();
    }

    async _playAnimation(animation) {
        let isPlayed = await super._playAnimation(animation);
        if (isPlayed) {
            return true;
        }

        switch (animation.type) {
            case ItemView.ANIMATION_TYPES.PICKED: 
                this._playPickedAnimation(animation.params);
                return true;
            case ItemView.ANIMATION_TYPES.DROPPED: 
                this._playDroppedAnimation(animation.params);
                return true;
            case ItemView.ANIMATION_TYPES.BE_BRINGED: 
                await this._playBeBringedAnimation(animation.params);
                return true;
            default:
                throw 'unknown type of animation';
        }
    }

    _playPickedAnimation() {
        this._toggleEntityVisibility(false);
    }

    _playDroppedAnimation({ dropPosition }) {
        this._renderEntityPosition(dropPosition);
        this._toggleEntityVisibility(true);
    }

    _playBeBringedAnimation({ pointFrom, pointTo, userSpeed, speedUpModifier }) {
        if (this._isFastAnimationMode) {
            this._renderEntityPosition(pointTo);
            return;
        }
        
        let dist = distance_point(pointFrom, pointTo);
        let wholeWalkTime = (dist / userSpeed) * 1000;
        wholeWalkTime = wholeWalkTime / speedUpModifier;
        let walkStartAt = null;

        return this._runAnimation(ItemView.ANIMATION_TYPES.BE_BRINGED, (currentTime) => {
            if (!walkStartAt) {
                walkStartAt = currentTime;
            }

            let timeInWalk = currentTime - walkStartAt;
            let progress = timeInWalk / wholeWalkTime;

            if (progress < 1) {
                let currentPosition = interpolatePoint(pointFrom, pointTo, progress);
                this._renderEntityPosition(currentPosition);

                return false;
            } else {
                this._renderEntityPosition(pointTo);
                return true;
            }
        });
    }

    _onPickedAnimationRequest() {
        this._addAnimation(ItemView.ANIMATION_TYPES.PICKED);
    }

    _onDroppedAnimationRequest(params) {
        this._addAnimation(ItemView.ANIMATION_TYPES.DROPPED, params);
    }

    async _onBeingBringedAnimationRequest(params) {
        this._addAnimation(ItemView.ANIMATION_TYPES.BE_BRINGED, params);
    }
    
}

export {
    ItemView
}