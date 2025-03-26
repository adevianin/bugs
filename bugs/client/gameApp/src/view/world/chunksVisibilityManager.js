class ChunksVisibilityManager {

    static _instance = null;

    static init(eventBus, chunks) {
        ChunksVisibilityManager._instance = new ChunksVisibilityManager(eventBus, chunks);
    }

    static isChunkVisible(chunkId) {
        return ChunksVisibilityManager._instance.isChunkVisible(chunkId);
    }

    static getVisibleChunkIds() {
        return ChunksVisibilityManager._instance.getVisibleChunkIds();
    }

    constructor(eventBus, chunks) {
        this._eventBus = eventBus;
        this._chunks = chunks;

        this._chunksVisibilityState = {};
        for (let chunkId in chunks) {
            this._chunksVisibilityState[chunkId] = false;
        }

        this._eventBus.on('viewPointChanged', this._onViewPointChanged.bind(this));
    }

    isChunkVisible(chunkId) {
        return this._chunksVisibilityState[chunkId];
    }

    getVisibleChunkIds() {
        let visibleChunkIds = [];
        for (let chunkId in this._chunksVisibilityState) {
            if (this._chunksVisibilityState[chunkId]) {
                visibleChunkIds.push(chunkId);
            }
        }

        return visibleChunkIds;
    }

    _onViewPointChanged(viewPoint, viewRect) {
        this._updateChunksVisibleStateForViewRect(viewRect);
    }

    _updateChunksVisibleStateForViewRect(viewRect) {
        let isSomeChunkVisibilityChanged = false;
        for (let chunkId in this._chunks) {
            let chunk = this._chunks[chunkId];
            let isVisibleChunk = chunk.intersectsRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
            let isStateChanged = this._chunksVisibilityState[chunkId] != isVisibleChunk
            this._chunksVisibilityState[chunkId] = isVisibleChunk;
            if (isStateChanged) {
                isSomeChunkVisibilityChanged = true;
                this._eventBus.emit(`chunkVisibilityStateChanged:${chunkId}`, isVisibleChunk);
            }
        }

        if (isSomeChunkVisibilityChanged) {
            this._eventBus.emit('someChunkVisibilityStateChanged');
        }
    }
}

export {
    ChunksVisibilityManager
}