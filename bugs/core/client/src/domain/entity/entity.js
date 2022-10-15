class Entity {

    constructor(id, pos, size) {
        this.id = id;
        this._pos = pos;
        this._size = size;
    }

    get position() {
        return {
            x: this._pos.x,
            y: this._pos.y,
        };
    }

    set position(position) {
        this._pos = {
            x: position.x,
            y: position.y
        }
    }

    get size() {
        return {
            width: this._size.width,
            height: this._size.height,
        };
    }

    updateEntity() {
    }
}

export {
    Entity
}