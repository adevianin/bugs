import { EntityTypes } from './entityTypes';

class World {
    constructor(eventBus) {
        this._eventBus = eventBus;
        this._entities = [];

        this._eventBus.on('died', this._on_died.bind(this));
    }

    get entities() {
        return [...this._entities];
    }

    set size(size) {
        this._size = size;
    }

    get size() {
        return this._size;
    }

    getAnts() {
        return this.findEntityByType(EntityTypes.ANT);
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    updateEntity(entityJson) {
        let entity = this.findEntityById(entityJson.id);
        entity.updateEntity(entityJson);
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

    findEntityByType(type) {
        let foundEntities = [];
        this._entities.forEach(e => {
            if (e.type == type) {
                foundEntities.push(e);
            }
        });

        return foundEntities;
    }

    clear() {
        this._entities = [];
        this._eventBus.emit('worldCleared');
    }

    _on_died(entity) {
        this.deleteEntity(entity.id);
    }

}

export { World }