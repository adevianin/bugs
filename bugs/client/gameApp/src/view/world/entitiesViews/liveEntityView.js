import { EntityView } from "./entityView";
import * as PIXI from 'pixi.js';
import { HpLineView } from "./hpLine";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { distance_point } from "@utils/distance";
import { interpolatePoint } from "@utils/interpolatePoint";

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
    };

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._stopListenHibernationStatusChangedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED}`, this._onHibernationStatusChangedAnimationRequest.bind(this));
        this._stopListenWalkAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_WALK}`, this._onWalkAnimationRequest.bind(this));
        this._stopListenRotateAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_ROTATED}`, this._onRotateAnimationRequest.bind(this));
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._pickedItemContainer = new PIXI.Container();
        
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._pickedItemContainer);
        this._entityContainer.addChild(this._uiContainer);

        this._standSprite = this._buildStandSprite();
        this._walkSprite = this._buildWalkSprite();
        this._deadSprite = this._buildDeadSprite();

        this._bodyContainer.addChild(this._standSprite);
        this._bodyContainer.addChild(this._walkSprite);
        this._bodyContainer.addChild(this._deadSprite);

        let halfEntityWidth = this._standSprite.width / 2;
        let halfEntityHeight = this._standSprite.height / 2;

        this._bodyContainer.pivot.x = halfEntityWidth;
        this._bodyContainer.pivot.y = halfEntityHeight;
        this._uiContainer.pivot.x = halfEntityWidth;
        this._uiContainer.pivot.y = halfEntityHeight;
        this._pickedItemContainer.y = -halfEntityHeight + 3;
        this._pickedItemContainer.pivot.x = halfEntityWidth;
        this._pickedItemContainer.pivot.y = halfEntityHeight;

        this._hpLineView = this._buildHpLineView();

        this._renderEntityState();
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._stopListenWalkAnimationRequest();
        this._stopListenRotateAnimationRequest();
        this._stopListenHibernationStatusChangedAnimationRequest();
    }

    _renderEntityState() {
        super._renderEntityState();
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

    _buildHpLineView() {
        return new HpLineView(this._entity, { x: 0, y: -4 }, this._standSprite.width, this._uiContainer);
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

    async _playAnimation(animation) {
        let isPlayed = await super._playAnimation(animation);
        if (isPlayed) {
            return true;
        }

        switch (animation.type) {
            case LiveEntityView.ANIMATION_TYPES.WALK: 
                await this._playWalkAnimation(animation.params);
                return true;
            case LiveEntityView.ANIMATION_TYPES.ROTATE: 
                this._playRotateAnimation(animation.params);
                return true;
            case LiveEntityView.ANIMATION_TYPES.HIBERNATION_STATUS_CHANGED: 
                this._playHibernationStatusChangedAnimation(animation.params);
                return true;
            default:
                return false;
        }
    }

    _playWalkAnimation({ pointFrom, pointTo, userSpeed, speedUpModifier }) {
        if (this._isFastAnimationMode) {
            this._renderEntityPosition(pointTo);
            this._renderVisualState(LiveEntityView.VISUAL_STATES.STANDING);
            return
        }

        let dist = distance_point(pointFrom, pointTo);
        let wholeWalkTime = (dist / userSpeed) * 1000;
        wholeWalkTime = wholeWalkTime / speedUpModifier; 
        let walkStartAt = null;

        this._renderVisualState(LiveEntityView.VISUAL_STATES.WALKING);
        return new Promise((res, rej) => {
            let animate = (currentTime) => {
                if (!walkStartAt) {
                    walkStartAt = currentTime;
                }

                let timeInWalk = currentTime - walkStartAt;
                let progress = timeInWalk / wholeWalkTime;

                if (progress < 1) {
                    let currentPosition = interpolatePoint(pointFrom, pointTo, progress);
                    this._renderEntityPosition(currentPosition);

                    requestAnimationFrame(animate);
                } else {
                    this._renderEntityPosition(pointTo);
                    this._renderVisualState(LiveEntityView.VISUAL_STATES.STANDING);
                    res();
                }
            }

            requestAnimationFrame(animate);
        });
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

        return new Promise((res, rej) => {
            let updateAngle = (currentTime) => {
                if (!rotationStartAt) {
                    rotationStartAt = currentTime;
                }

                let rotatingTime = currentTime - rotationStartAt;
                let rotatedPercent = rotatingTime / wholeRotationTime;
                if (rotatedPercent < 1) {
                    this._renderEntityAngle(startAngle + (angleDistance * rotatedPercent));
                    requestAnimationFrame(updateAngle);
                } else {
                    this._renderEntityAngle(newAngle);
                    res();
                }
            }
    
            requestAnimationFrame(updateAngle);
        });
    }

    _playHibernationStatusChangedAnimation({ isEntityVisibleAfter }) {
        this._toggleEntityVisibility(isEntityVisibleAfter);
    }

    _playDiedAnimation() {
        this._renderVisualState(LiveEntityView.VISUAL_STATES.DEAD);
        setTimeout(() => {
            this.remove();
        }, 5000);
    }

    async _onWalkAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.WALK, params);
    }

    async _onRotateAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.ROTATE, params);
    }

    async _onHibernationStatusChangedAnimationRequest(params) {
        this._addAnimation(LiveEntityView.ANIMATION_TYPES.HIBERNATION_STATUS_CHANGED, params);
    }

}

export {
    LiveEntityView
}