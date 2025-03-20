import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class EntityView extends BaseGraphicView {

    static chunksVisibilityState;

    static useChunksVisibilityState(chunksVisibilityState) {
        EntityView.chunksVisibilityState = chunksVisibilityState;
    }

    constructor(entity, entitiesContainer) {
        super();
        this._entity = entity;
        this._parentContainer = entitiesContainer;
        this._entityContainer = new PIXI.Container();
        this._parentContainer.addChild(this._entityContainer);

        this._stopListenDied = this._entity.on('died', this.remove.bind(this));
        this._stopListenChunkIdChanged = this._entity.on('chunkIdChanged', this._onChunkIdChanged.bind(this));

        this._listenEntityChunkVisibilityChanges();
        this._renderVisibility();
    }

    get entity() {
        return this._entity;
    }

    remove() {
        this._parentContainer.removeChild(this._entityContainer);
        this._stopListenDied();
        this._stopListenChunkVisibilityChange();
        this._stopListenChunkIdChanged();
    }

    _listenEntityChunkVisibilityChanges() {
        if (this._stopListenChunkVisibilityChange) {
            this._stopListenChunkVisibilityChange();
        }
        let eventName = `chunkVisibilityStateChanged:${this._entity.chunkId}`;
        this._stopListenChunkVisibilityChange = this.$eventBus.on(eventName, this._onChunkVisibilityStateChanged.bind(this));
    }

    _renderVisibility() {
        let isChunkVisible = EntityView.chunksVisibilityState[this._entity.chunkId];
        this._entityContainer.renderable = isChunkVisible && this._entity.isVisible;
    }

    _onChunkVisibilityStateChanged(isVisible) {
        this._renderVisibility();
    }

    _onChunkIdChanged() {
        this._listenEntityChunkVisibilityChanges();
        this._renderVisibility();
    }
    
}

export {
    EntityView
}