import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { VIEW_SETTINGS } from "@view/viewSettings";
import { distance_point } from '@utils/distance';
import { interpolatePoint } from '@utils/interpolatePoint';

class EntityView extends BaseGraphicView {

    static ANIMATION_TYPES = class {
        static CHUNK_CHANGED = 'chunk_changed';
        static DIED = 'died';
    };

    constructor(entity, entitiesContainer, entitiesLayer) {
        super();
        this._animQueue = [];
        this._isAnimPlaying = false;
        this._isEntityVisible = false;

        this._entity = entity;
        this._parentContainer = entitiesContainer;
        this._entityContainer = new PIXI.Container({label: entity.type});
        this._parentContainer.addChild(this._entityContainer);

        this._entitiesLayer = entitiesLayer;
        this._entitiesLayer.attach(this._entityContainer);

        this._timeoutIds = [];

        this._animationsData = {};

        this._isRemoved = false;

        let eId = this._entity.id;
        this._stopListenEntityDiedAR = this.$eventBus.on(`entityActionAnimationRequest:${eId}:${ACTION_TYPES.ENTITY_DIED}`, this._onDiedAnimationRequest.bind(this));
    }

    get entity() {
        return this._entity;
    }

    get _isFastAnimationMode() {
        return VIEW_SETTINGS.isFastAnimations;
    }

    remove() {
        this._isRemoved = true;
        this._clearAllTimeouts();
        this._stopAnyAnimations();
        this._entityContainer.removeFromParent();
        this._entityContainer.destroy({children: true});
        this._removedDuringAnimation = this._currentAnimation;
        this._stopListenEntityDiedAR();
        this._entitiesLayer.detach(this._entityContainer);
    }

    checkIsRefreshAnimationsNeeded() {
        return this._hasBlockingAnimationInQueue();
    }

    _toggleEntityVisibility(isVisible) {
        this._setIsEntityVisible(isVisible);
        this._renderViewVisibility();
    }

    _addAnimation(type, params = {}, isBlocking = false) {
        this._animQueue.push({type, params, isBlocking});
        this._tryPlayNextAnim();
    }

    async _tryPlayNextAnim() {
        if (this._animQueue.length == 0 || this._isAnimPlaying || this._isRemoved) {
            return;
        }

        let animation = this._animQueue[0];
        this._animQueue.shift();

        this._isAnimPlaying = true;
        this._lastPlayedanim = animation
        let resp = this._playAnimation(animation);
        if (!resp.isPlayed) {
            console.warn(`not played animation type "${animation.type}"`);
        }
        await resp.animationPromise;
        this._isAnimPlaying = false;
        this._tryPlayNextAnim();
    }

    _playAnimation(animation) {
        switch (animation.type) {
            case EntityView.ANIMATION_TYPES.DIED: 
                this._playDiedAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    _makePlayAnimationResponse(isPlayed, animationPromise) {
        animationPromise = animationPromise || Promise.resolve();
        return {
            isPlayed,
            animationPromise
        };
    }
    
    _renderEntityState() {
        this._setIsEntityVisible(this._entity.isVisible);
        this._renderViewVisibility();
        this._renderEntityPosition(this._entity.position);
        this._renderEntityAngle(this._entity.angle);
    }

    _renderEntityPosition({x, y}) {
        this._entityContainer.x = x;
        this._entityContainer.y = y;
    }

    _renderEntityAngle(angle) {
        this._entityContainer.angle = angle;
    }

    _setIsEntityVisible(isVisible) {
        this._isEntityVisible = isVisible;
    }

    checkIsEntityVisible() {
        return this._isEntityVisible;
    }

    _renderViewVisibility() {
        this._entityContainer.renderable = this._isEntityVisible;
    }

    _playDiedAnimation() {
        this.events.emit('playedDiedAnimation', 10);
    }

    _runAnimation(type, animation) {
        if (this._animationsData[type]){
            this._stopRunningAnimationByType(type);
            delete this._animationsData[type];
        }

        if (this._isRemoved) {
            this._isRunningAnimationAfterRemoved = true;
        }
        let animationData = {frameRequestId: null, makeAnimDone: null};
        this._animationsData[type] = animationData;
        return new Promise((res, rej) => {
            animationData.makeAnimDone = res;
            let doAnimation = () => {
                animationData.frameRequestId = requestAnimationFrame((t) => {
                    let isDone = animation(t);
                    if (isDone) {
                        delete this._animationsData[type];
                        res();
                    } else {
                        doAnimation();
                    }
                });
            };

            doAnimation();
            
        });
    }

    _stopAnyAnimations() {
        this._animQueue = [];
        this._stopAllRunningAnimations();
    }

    _stopAllRunningAnimations() {
        for (let animType in this._animationsData) {
            this._stopRunningAnimationByType(animType);
        }
        this._animationsData = {};
    }

    _stopRunningAnimationByType(type) {
        let animData = this._animationsData[type];
        cancelAnimationFrame(animData.frameRequestId);
        animData.makeAnimDone();
    }

    _onDiedAnimationRequest(params) {
        this._addAnimation(EntityView.ANIMATION_TYPES.DIED, params, false);
    }

    _hasBlockingAnimationInQueue() {
        return this._animQueue.some(anim => anim.isBlocking);
    }

    _playEntityWalkAnimation({ pointFrom, pointTo, userSpeed }, animationType) {
        if (this._isFastAnimationMode) {
            this._renderEntityPosition(pointTo);
            return
        }

        let animationStep = this.$domain.currentStep;
        let dist = distance_point(pointFrom, pointTo);
        let wholeWalkTime = (dist / userSpeed) * 1000;
        let leftTimeForStep = this.$stepProgress.getLeftTimeForStep(animationStep);
        let walkTime = Math.min(wholeWalkTime, leftTimeForStep);
        
        let walkStartAt = null;
        return this._runAnimation(animationType, (currentTime) => {
            if (!walkStartAt) {
                walkStartAt = currentTime;
            }

            let isAnimationStepDone = this.$domain.currentStep > animationStep;
            let timeInWalk = currentTime - walkStartAt;
            let progress = timeInWalk / walkTime;

            if (progress >= 1 || isAnimationStepDone) {
                this._renderEntityPosition(pointTo);
                
                return true;
            } else {
                let currentPosition = interpolatePoint(pointFrom, pointTo, progress);
                this._renderEntityPosition(currentPosition);

                return false;
            }
        });
    }

    _setTimeout(func, time) {
        let id = setTimeout(func, time);
        this._timeoutIds.push(id);
    }

    _clearAllTimeouts() {
        this._timeoutIds.forEach(id => clearTimeout(id));
        this._timeoutIds.length = 0;
    }
    
}

export {
    EntityView
}