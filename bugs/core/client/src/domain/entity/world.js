class World {
    constructor(entities) {
        this._entities = entities
    }

    get entities() {
        return [...this._entities];
    }

    updateEntity(entityJson) {
        let entity = this._findEntityById(entityJson.id);
        entity.updateEntity(entityJson);
    }

    _findEntityById(id) {
        return this._entities.find( entity => entity.id === id);
    }

}

export { World }