import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class EntityView extends BaseGraphicView {

    static ANIMATION_TYPES = class {
        static CHUNK_CHANGED = 'chunk_changed';
        static DIED = 'died';
    };

    static chunksVisibilityState;

    static useChunksVisibilityState(chunksVisibilityState) {
        EntityView.chunksVisibilityState = chunksVisibilityState;
    }

    constructor(entity, entitiesContainer) {
        super();
        this._animQueue = [];
        this._isAnimPlaying = false;
        this._currentChunkId = null;
        this._isEntityVisible = false;
        this._isGameActive = true;

        this._entity = entity;
        this._parentContainer = entitiesContainer;
        this._entityContainer = new PIXI.Container();
        this._parentContainer.addChild(this._entityContainer);

        document.addEventListener("visibilitychange", this._onGameActivityChange.bind(this));
        this._stopListenChunkIdChanged = this._entity.on('chunkIdChanged', this._onEntityChunkIdChanged.bind(this));
        this._stopListenDiedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_DIED}`, this._onDiedAnimationRequest.bind(this));
    }

    get entity() {
        return this._entity;
    }

    get _isCurrentChunkVisible() {
        return EntityView.chunksVisibilityState[this._currentChunkId];
    }

    get _isFastAnimationMode() {
        return !this._isCurrentChunkVisible;
    }

    remove() {
        this._entityContainer.removeFromParent();
        this._stopListenChunkVisibilityChange();
        this._stopListenChunkIdChanged();
        this._stopListenDiedAnimationRequest();
    }

    _toggleEntityVisibility(isVisible) {
        this._setIsEntityVisible(isVisible);
        this._renderViewVisibility();
    }

    _addAnimation(type, params = {}) {
        if (!this._isGameActive) {
            return;
        }
        this._animQueue.push({type, params});
        this._tryPlayNextAnim();
    }

    async _tryPlayNextAnim() {
        if (this._animQueue.length == 0 || this._isAnimPlaying) {
            return;
        }

        let animation = this._animQueue[0];
        this._animQueue.shift();

        animation.params.speedUpModifier = this._calcSpeedUpMultiplier(animation);

        this._isAnimPlaying = true;
        await this._playAnimation(animation);
        this._isAnimPlaying = false;
        this._tryPlayNextAnim();
    }

    _calcSpeedUpMultiplier(checkingAnimation) {
        let count = 0;
        for (let animation of this._animQueue) {
            if (animation.type == checkingAnimation.type) {
                count++;
            }
        }

        switch (count) {
            case 0:
                return 1;
            case 1:
                return 1.3;
            case 2:
                return 2;
            case 3:
                return 4;
            default:
                return 50;
        }
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
        this._setCurrentChunkId(newChunkId);
        this._renderViewVisibility();
    }

    async _playDiedAnimation() {
        this.remove();
    }

    _onCurrentChunkVisibilityStateChanged() {
        this._renderViewVisibility();
    }

    _onEntityChunkIdChanged(newChunkId) {
        this._addAnimation(EntityView.ANIMATION_TYPES.CHUNK_CHANGED, {
            newChunkId
        });
    }

    _onDiedAnimationRequest(params) {
        this._addAnimation(EntityView.ANIMATION_TYPES.DIED, params);
    }

    _onGameActivityChange() {
        if (document.hidden) {
            this._isGameActive = false;
            this._animQueue = [];
        } else {
            this._isGameActive = true;
            this._renderEntityState();
        }
    }
    
}

export {
    EntityView
}