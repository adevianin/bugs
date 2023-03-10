class World {
    constructor(eventBus, entities) {
        this._eventBus = eventBus;
        this._entities = entities;

        this._eventBus.on('died', this._on_died.bind(this));
    }

    get entities() {
        return [...this._entities];
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    updateEntity(entityJson) {
        let entity = this.findEntityById(entityJson.id);
        entity.updateEntity(entityJson);
    }

    playAction(action) {
        let entity = this.findEntityById(action.entityId);
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

    _on_died(entity) {
        this.deleteEntity(entity.id);
    }

}

export { World }