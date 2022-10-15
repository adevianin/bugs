class World {
    constructor(bugs) {
        this._bugs = bugs;
    }

    get bugs() {
        return [...this._bugs];
    }

    updateEntity(entityJson) {
        let entity = this._findEntityById(entityJson.id);
        if (entity) {
            entity.updateEntity(entityJson);
        } else {
            console.warn(`entity with id="${entityJson.id}" is not found`);
        }
    }

    _findEntityById(id) {
        return this._bugs.find(b => { return b.id === id });
    }
}

export { World }