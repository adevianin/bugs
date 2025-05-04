import { EntityView } from "./entityView";
import * as PIXI from 'pixi.js';
import { HpLineView } from "./hpLine";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class LiveEntityView extends EntityView {

    static VISUAL_STATES = class {
        static DEAD = 'dead';
        static STANDING = 'standing';
        static WALKING = 'walking';
    };

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static WALK = 'walk';
        static ROTATE = 'rotate';
        static HIBERNATION_STATUS_CHANGED = 'hibernation_status_changed';
        static HP_CHANGED = 'hp_changed';
    };

    constructor(entity, entitiesContainer, entitiesLayer, liveEntityHudLayer) {
        super(entity, entitiesContainer, entitiesLayer);
        this._liveEntityHudLayer = liveEntityHudLayer;

        let eId = this._entity.id;
        this._stopListenWalkAR = this.$eventBus.on(`entityActionAnimationRequest:${eId}:${ACTION_TYPES.ENTITY_WALK}`, this._onWalkAnimationRequest.bind(this));
        this._stopListenRotateAR = this.$eventBus.on(`entityActionAnimationRequest:${eId}:${ACTION_TYPES.ENTITY_ROTATED}`, this._onRotateAnimationRequest.bind(this));
        this._stopListenHpChangeAR = this.$eventBus.on(`entityActionAnimationRequest:${eId}:${ACTION_TYPES.ENTITY_HP_CHANGE}`, this._onHpChangeAnimationRequest.bind(this));
        this._stopListenHibernationStatusChangedAR = this.$eventBus.on(`entityActionAnimationRequest:${eId}:${ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED}`, this._onHibernationStatusChangedAnimationRequest.bind(this));
    }

    get _entityWidth() {
        return this._standSprite.width;
    }

    get _entityHeight() {
        return this._standSprite.height;
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._hudContainer = new PIXI.Container();
        this._pickedItemContainer = new PIXI.Container();
        
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._pickedItemContainer);
        this._entityContainer.addChild(this._hudContainer);

        this._liveEntityHudLayer.attach(this._hudContainer);

        this._standSprite = this._buildStandSprite();
        this._walkSprite = this._buildWalkSprite();
        this._deadSprite = this._buildDeadSprite();

        this._bodyContainer.addChild(this._standSprite);
        this._bodyContainer.addChild(this._walkSprite);
        this._bodyContainer.addChild(this._deadSprite);

        let halfEntityWidth = this._entityWidth / 2;
        let halfEntityHeight = this._entityWidth / 2;
        
        this._bodyContainer.pivot.set(halfEntityWidth, halfEntityHeight);

        this._pickedItemTopY =  -halfEntityHeight + 3;
        this._pickedItemContainer.y = this._pickedItemTopY;
        this._pickedItemContainer.pivot.set(halfEntityWidth, halfEntityHeight);

        this._hpTopY = -halfEntityHeight-5;
        this._hpLineView = new HpLineView({ x: -halfEntityWidth, y: this._hpTopY }, this._entityWidth, this._entity.maxHp, this._hudContainer);

        this._renderEntityState();
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._stopListenWalkAR();
        this._stopListenRotateAR();
        this._stopListenHpChangeAR();
        this._stopListenHibernationStatusChangedAR();
        this._liveEntityHudLayer.detach(this._hudContainer);
    }

    _renderEntityState() {
        super._renderEntityState();
        this._hpLineView.showValue(this._entity.hp);
        this._renderVisualState(LiveEntityView.VISUAL_STATES.STANDING);
    }

    _buildStandSprite() {
        throw 'abstract method';
    }

    _buildWalkSprite() {
        throw 'abstract method';
    }

    _buildDeadSprite() {
        throw 'abstract method';
    }

    _renderEntityAngle(angle) {
        this._bodyContainer.angle = angle;
    }

    _renderVisualState(state) {
        this._toggleStandingState(state == LiveEntityView.VISUAL_STATES.STANDING);
        this._toggleWalkingState(state == LiveEntityView.VISUAL_STATES.WALKING);
        this._toggleDeadState(state == LiveEntityView.VISUAL_STATES.DEAD);
    }

    _toggleWalkingState(isEnabling) {
        if (isEnabling) {
            this._walkSprite.renderable = true;
            this._walkSprite.play();
        } else {
            this._walkSprite.renderable = false;
            this._walkSprite.stop();
        }
    }

    _toggleStandingState(isEnabling) {
        this._standSprite.renderable = isEnabling;
    }

    _toggleDeadState(isEnabling) {
        this._deadSprite.renderable = isEnabling;
    }

    _playAnimation(animation) {
        let resp = super._playAnimation(animation);
        if (resp.isPlayed) {
            return resp;
        }

        switch (animation.type) {
            case LiveEntityView.ANIMATION_TYPES.WALK: 
                let animPromise = this._playWalkAnimation(animation.params);
                return this._makePlayAnimationResponse(true, animPromise);
            case LiveEntityView.ANIMATION_TYPES.ROTATE: 
                this._playRotateAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            case LiveEntityView.ANIMATION_TYPES.HIBERNATION_STATUS_CHANGED: 
                this._playHibernationStatusChangedAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            case LiveEntityView.ANIMATION_TYPES.HP_CHANGED: 
                this._playHpChangedAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    async _playWalkAnimation(params) {
        this._renderVisualState(LiveEntityView.VISUAL_STATES.WALKING);
        await this._playEntityWalkAnimation(params, LiveEntityView.ANIMATION_TYPES.WALK);
        this._renderVisualState(LiveEntityView.VISUAL_STATES.STANDING);
    }

    _playRotateAnimation({ startAngle, newAngle }) {
        if (this._isFastAnimationMode) {
            this._renderEntityAngle(newAngle);
            return;
        }

        let angleDistance = newAngle - startAngle;
        let rotationStartAt = null;
        let wholeRotationTime = 150;

        if (angleDistance > 180) {
            angleDistance -= 360;
        } else if (angleDistance < -180) {
            angleDistance += 360;
        }

        return this._runAnimation(LiveEntityView.ANIMATION_TYPES.ROTATE, (currentTime) => {
            if (!rotationStartAt) {
                rotationStartAt = currentTime;
            }

            let rotatingTime = currentTime - rotationStartAt;
            let rotatedPercent = rotatingTime / wholeRotationTime;
            if (rotatedPercent < 1) {
                this._renderEntityAngle(startAngle + (angleDistance * rotatedPercent));
                return false;
            } else {
                this._renderEntityAngle(newAngle);
                return true;
            }
        });
    }

    _playHibernationStatusChangedAnimation({ isEntityVisibleAfter }) {
        this._toggleEntityVisibility(isEntityVisibleAfter);
    }

    _playHpChangedAnimation({ hp }) {
        this._hpLineView.showValue(hp);
    }

    _playDiedAnimation() {
        this._renderVisualState(LiveEntityView.VISUAL_STATES.DEAD);
        this._hudContainer.renderable = false;
        this.events.emit('playedDiedAnimation', 5000);
    }

    _onWalkAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.WALK, params, true);
    }

    _onRotateAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.ROTATE, params);
    }

    _onHibernationStatusChangedAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.HIBERNATION_STATUS_CHANGED, params);
    }

    _onHpChangeAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.HP_CHANGED, params);
    }

}

export {
    LiveEntityView
}