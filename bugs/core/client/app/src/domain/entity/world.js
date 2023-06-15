import { EntityTypes } from "../enum/entityTypes";
import { AntTypes } from "../enum/antTypes";

class World {
    constructor(eventBus) {
        this._eventBus = eventBus;
        this._entities = [];
        this._colonies = [];

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

    addColony(colony) {
        this._colonies.push(colony);
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
        return this._entities.find( entity => entity.id == id);
    }

    findColonyById(id) {
        return this._colonies.find( colony => colony.id == id);
    }

    findColonyByOwnerId(ownerId) {
        return this._colonies.find(colony => colony.ownerId == ownerId);
    }

    findAntsFromColony(colonyId) {
        return this._entities.filter(e => e.type == EntityTypes.ANT && e.fromColony == colonyId);
    }

    findNestsFromColony(colonyId) {
        return this._entities.filter(e => e.type == EntityTypes.NEST && e.fromColony == colonyId);
    }

    findQueenByOwnerId(ownerId) {
        let colony = this.findColonyByOwnerId(ownerId);
        let colonyAnts = this.findAntsFromColony(colony.id);

        return colonyAnts.find(a => a.antType == AntTypes.QUEEN);
    }

    findEntityByType(type) {
        return this._entities.filter(e => e.type == type);
    }

    clear() {
        this._entities = [];
        this._colonies = [];
        this._eventBus.emit('worldCleared');
    }

    _on_died(entity) {
        this.deleteEntity(entity.id);
    }

}

export { World }