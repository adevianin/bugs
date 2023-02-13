class World {
    constructor(entities) {
        this._entities = entities
    }

    get entities() {
        return [...this._entities];
    }

    updateEntity(entityJson) {
        let entity = this.findEntityById(entityJson.id);
        entity.updateEntity(entityJson);
    }

    playAction(action) {
        let entity = this.findEntityById(action.entity_id);
        entity.addAction(action);
    }

    deleteEntity(entityId) {
        let entityIndex = -1;
        for (let i = 0; i < this._entities.length; i++)  {
            if (this._entities[i].id == entityId) {
                entityIndex = i;
                break;
            }
        }

        if (entityIndex != -1) {
            this._entities.splice(entityIndex, 1);
        }
    }

    findEntityById(id) {
        return this._entities.find( entity => entity.id === id);
    }

}

export { World }