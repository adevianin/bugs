class Chunk {

    constructor(x, y, width, height) {
        this._entities = [];
        this._shape = {x, y, width, height};
    }

    get shape() {
        return this._shape;
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    removeEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (index > -1) {
            this._entities.splice(index, 1);
        }
    }

    hasEntity(entity) {
        let index = this._entities.indexOf(entity);
        return index > -1;
    }

    // containsPoint({x, y}) {
    //     let minX = this._shape.x;
    //     let maxX = this._shape.x + this._shape.width - 1;
    //     let minY = this._shape.y;
    //     let maxY = this._shape.y + this._shape.height - 1;

    //     return x >= minX && x <= maxX && y >= minY && y <= maxY;
    // }

    intersectsRect(x, y, width, height) {
        let chunkMinX = this._shape.x;
        let chunkMaxX = this._shape.x + this._shape.width - 1;
        let chunkMinY = this._shape.y;
        let chunkMaxY = this._shape.y + this._shape.height - 1;

        let otherMinX = x;
        let otherMaxX = x + width - 1;
        let otherMinY = y;
        let otherMaxY = y + height - 1;

        return !(
            chunkMaxX < otherMinX || 
            chunkMinX > otherMaxX || 
            chunkMaxY < otherMinY ||
            chunkMinY > otherMaxY
        );
    }
}

export {
    Chunk
}