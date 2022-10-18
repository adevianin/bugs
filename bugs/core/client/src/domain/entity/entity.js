class Entity {

    constructor(id, pos, size) {
        this.id = id;
        this._pos = pos;
        this._size = size;
    }

    setPosition(x, y) {
        console.log('set position', x ,y );
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