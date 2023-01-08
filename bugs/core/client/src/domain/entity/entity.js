class Entity {

    constructor(mainEventBus, id, pos, size, type) {
        this.id = id;
        this._pos = pos;
        this._size = size;
        this._mainEventBus = mainEventBus
        this._type = type
    }

    setPosition(x, y) {
        this._pos = { x, y }
    }

    get size() {
        return {
            width: this._size.width,
            height: this._size.height,
        };
    }

    get position() {
        return {
            x: this._pos.x,
            y: this._pos.y,
        };
    }

    updateEntity() {
    }
}

export {
    Entity
}