class ViewPointManager {

    constructor() {
        this._chunksVisibilityState = {};
    }

    get chunks() {
        return this._chunks;
    }

    setChunks(chunks) {
        this._chunks = chunks;

        for (let chunkId in chunks) {
            this._chunksVisibilityState[chunkId] = false;
        }
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

    updateChunksVisibleStateForViewRect(viewRect) {
        let isSomeChunkVisibilityChanged = false;
        for (let chunkId in this._chunks) {
            let chunk = this._chunks[chunkId];
            let isVisibleChunk = chunk.intersectsRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
            let isStateChanged = this._chunksVisibilityState[chunkId] != isVisibleChunk
            this._chunksVisibilityState[chunkId] = isVisibleChunk;
            if (isStateChanged) {
                isSomeChunkVisibilityChanged = true;
            }
        }

        return isSomeChunkVisibilityChanged;
    }

    getEntitiesFromVisibleChunks() {
        let entities = [];
        for (let chunkId in this._chunks) {
            if (this.isChunkVisible(chunkId)) {
                let chunk = this._chunks[chunkId];
                entities = entities.concat(chunk.entities);
            }
        }

        return entities;
    }
}

export {
    ViewPointManager
}