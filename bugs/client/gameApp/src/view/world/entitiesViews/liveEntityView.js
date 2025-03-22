import { EntityView } from "./entityView";
import * as PIXI from 'pixi.js';
import { HpLineView } from "./hpLine";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { entityWalker } from "@utils/entityWalker";

class LiveEntityView extends EntityView {

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);
        
        this._unbindPositionChangedListener = this._entity.on('positionChanged', this._renderPosition.bind(this));
        this._unbindAngleChangedListener = this._entity.on('angleChanged', this._renderAngle.bind(this));
        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderState.bind(this));
        this._unbindHibernationStateListener = this._entity.on('isInHibernationChanged', this._renderVisibility.bind(this));
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

        this._renderPosition();
        this._renderAngle();
        this._renderState();
    }

    remove() {
        setTimeout(() => {
            super.remove();
        }, 5000);
        this._unbindPositionChangedListener();
        this._unbindAngleChangedListener();
        this._unbindStateChangeListener();
        this._unbindHibernationStateListener();
        this._hpLineView.remove();
        this._stopListenWalkAnimationRequest();
        this._stopListenRotateAnimationRequest();
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

    _renderPosition() {
        this._entityContainer.x = this._entity.position.x;
        this._entityContainer.y = this._entity.position.y;
    }

    _renderAngle() {
        this._bodyContainer.angle = this._entity.angle;
    }

    _renderState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
        this._toggleDeadState(state == 'dead');
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

    async _onWalkAnimationRequest(animationParams, timeMultiplier, onDone) {
        if (this._entityContainer.renderable) {
            await entityWalker(this._entity, animationParams.destinationPosition, animationParams.userSpeed, timeMultiplier);
            onDone();
        } else {
            this._entity.setPosition(animationParams.destinationPosition.x, animationParams.destinationPosition.y);
            onDone();
        }
    }

    async _onRotateAnimationRequest(animationParams, timeMultiplier, onDone) {
        if (this._entityContainer.renderable) {
            let startAngle = this._entity.angle;
            let newAngle = animationParams.newAngle;
            let angleDistance = newAngle - this._entity.angle;
            let rotationStartTime = Date.now();
            let wholeRotationTime = 150;
            wholeRotationTime *= timeMultiplier;

            if (angleDistance > 180) {
                angleDistance -= 360;
            } else if (angleDistance < -180) {
                angleDistance += 360;
            }

            let updateAngle = () => {
                let rotatingTime = Date.now() - rotationStartTime;
                let rotatedPercent = (100 * rotatingTime) / wholeRotationTime;
                if (rotatedPercent < 100) {
                    this._entity.angle = startAngle + (angleDistance * rotatedPercent / 100);
                    requestAnimationFrame(updateAngle);
                } else {
                    this._entity.angle = newAngle;
                    onDone();
                }
            }

            requestAnimationFrame(updateAngle);
        } else {
            this._entity.angle = animationParams.newAngle;
            onDone();
        }
    }

}

export {
    LiveEntityView
}