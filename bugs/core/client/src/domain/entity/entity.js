class Entity {

    constructor(id, position, type) {
        this.id = id;
        this._position = position;
        this.type = type
    }

    setPosition(x, y) {
        this._position = {x, y};
    }

    get position(){
        return this._position;
    }

    updateEntity(entityJson) {
    }
}

export {
    Entity
}