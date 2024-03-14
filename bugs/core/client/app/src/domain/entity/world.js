import { EntityTypes } from "../enum/entityTypes";

class World {
    constructor(mainEventBus) {
        this._mainEventBus = mainEventBus;
        this._entities = [];
        this._colonies = [];

        this._mainEventBus.on('entityDied', this._onDied.bind(this));
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

    getNests() {
        return this.findEntityByType(EntityTypes.NEST);
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

    findColoniesByOwnerId(ownerId) {
        return this._colonies.filter(colony => colony.ownerId == ownerId);
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

    getQueenOfColony(colonyId) {
        let colony = this.findColonyById(colonyId);
        let queen = null;
        if (colony.queenId) {
            queen = this.findEntityById(colony.queenId);
        }

        return queen;
    }

    findEntityByType(type) {
        return this._entities.filter(e => e.type == type);
    }

    clear() {
        this._entities = [];
        this._colonies = [];
    }

    _onDied(entity) {
        this.deleteEntity(entity.id);
    }

}

export { World }