import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { ChunksVisibilityManager } from "../chunksVisibilityManager";
import { VIEW_SETTINGS } from "@view/viewSettings";
import { distance_point } from '@utils/distance';
import { interpolatePoint } from '@utils/interpolatePoint';

class EntityView extends BaseGraphicView {

    static ANIMATION_TYPES = class {
        static CHUNK_CHANGED = 'chunk_changed';
        static DIED = 'died';
    };

    constructor(entity, entitiesContainer) {
        super();
        this._animQueue = [];
        this._isAnimPlaying = false;
        this._currentChunkId = null;
        this._isEntityVisible = false;

        this._entity = entity;
        this._parentContainer = entitiesContainer;
        this._entityContainer = new PIXI.Container();
        this._parentContainer.addChild(this._entityContainer);

        this._animationsData = {};

        this._stopListenChunkIdChanged = this._entity.on('chunkIdChanged', this._onEntityChunkIdChanged.bind(this));
        this._stopListenDiedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_DIED}`, this._onDiedAnimationRequest.bind(this));
        this._stopListenStetStart = this.$eventBus.on('stepStart', this._onStepStart.bind(this));
    }

    get entity() {
        return this._entity;
    }

    get _isCurrentChunkVisible() {
        return ChunksVisibilityManager.isChunkVisible(this._currentChunkId);
    }

    get _isFastAnimationMode() {
        return !this._isCurrentChunkVisible || VIEW_SETTINGS.isFastAnimations;
    }

    remove() {
        this._entityContainer.removeFromParent();
        this._entityContainer.destroy({children: true});
        this._stopListenChunkVisibilityChange();
        this._stopListenChunkIdChanged();
        this._stopListenDiedAnimationRequest();
        this._stopListenStetStart();
    }

    _toggleEntityVisibility(isVisible) {
        this._setIsEntityVisible(isVisible);
        this._renderViewVisibility();
    }

    _addAnimation(type, params = {}, isBlocking = false) {
        if (this._isCurrentChunkVisible || type == EntityView.ANIMATION_TYPES.CHUNK_CHANGED) {
            this._animQueue.push({type, params, isBlocking});
            this._tryPlayNextAnim();
        }
    }

    async _tryPlayNextAnim() {
        if (this._animQueue.length == 0 || this._isAnimPlaying) {
            return;
        }

        let animation = this._animQueue[0];
        this._animQueue.shift();

        this._isAnimPlaying = true;
        await this._playAnimation(animation);
        this._isAnimPlaying = false;
        this._tryPlayNextAnim();
    }

    async _playAnimation(animation) {
        switch (animation.type) {
            case EntityView.ANIMATION_TYPES.CHUNK_CHANGED: 
                this._playChunkChangedAnimation(animation.params);
                return true;
            case EntityView.ANIMATION_TYPES.DIED: 
                await this._playDiedAnimation(animation.params);
                return true;
            default:
                return false;
        }
    }
    
    _renderEntityState() {
        this._setCurrentChunkId(this._entity.chunkId);
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

    _setCurrentChunkId(chunkId) {
        this._currentChunkId = chunkId;
        this._listenCurrentChunkVisibilityChanges();
    }

    _listenCurrentChunkVisibilityChanges() {
        if (this._stopListenChunkVisibilityChange) {
            this._stopListenChunkVisibilityChange();
        }
        let eventName = `chunkVisibilityStateChanged:${this._currentChunkId}`;
        this._stopListenChunkVisibilityChange = this.$eventBus.on(eventName, this._onCurrentChunkVisibilityStateChanged.bind(this));
    }

    _renderViewVisibility() {
        this._entityContainer.renderable = this._isEntityVisible && this._isCurrentChunkVisible;
    }

    _playChunkChangedAnimation({ newChunkId }) {
        let isChunkVisibleBefore = this._isCurrentChunkVisible;
        this._setCurrentChunkId(newChunkId);
        let isChunkVisibleAfter = this._isCurrentChunkVisible;

        if (isChunkVisibleBefore == true && isChunkVisibleAfter == false) {
            this._renderViewVisibility();
        }else if (isChunkVisibleBefore == false && isChunkVisibleAfter == true) {
            this._renderEntityState();
        }
    }

    async _playDiedAnimation() {
        this.remove();
    }

    _runAnimation(type, animation) {
        if (this._animationsData[type]){
            this._stopRunningAnimationByType(type);
            delete this._animationsData[type];
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

    _onCurrentChunkVisibilityStateChanged() {
        if (this._isCurrentChunkVisible) {
            this._renderEntityState();
        } else {
            this._renderViewVisibility();
        }
    }

    _onEntityChunkIdChanged(newChunkId) {
        if (!this._entity.isDied) {
            this._addAnimation(EntityView.ANIMATION_TYPES.CHUNK_CHANGED, {
                newChunkId
            });
        }
    }

    _onDiedAnimationRequest(params) {
        this._addAnimation(EntityView.ANIMATION_TYPES.DIED, params, false);
    }

    _onStepStart() {
        if (this._hasBlockingAnimationInQueue()) {
            this._refreshAnimations();
        }
    }

    _refreshAnimations() {
        this._animQueue = [];
        this._stopAllRunningAnimations();
        this._renderEntityState();
        if (this._entity.isDied) {
            this._playDiedAnimation();
        }
        console.warn('refreshed animations')
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
        let walkTime = wholeWalkTime <= leftTimeForStep ? wholeWalkTime : leftTimeForStep;
        
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
    
}

export {
    EntityView
}