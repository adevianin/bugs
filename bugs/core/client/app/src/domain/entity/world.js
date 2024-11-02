import { EntityTypes } from "../enum/entityTypes";

class World {
    constructor(mainEventBus, climate) {
        this._mainEventBus = mainEventBus;
        this._entities = [];
        this._colonies = [];
        this._climate = climate;
        this._currentStep = 0;

        this._mainEventBus.on('entityDied', this._onEntityDied.bind(this));
        this._mainEventBus.on('colonyDied', this._onColonyDied.bind(this));
    }

    get currentStep() {
        return this._currentStep;
    }

    set currentStep(stepNumber) {
        this._currentStep = stepNumber;
        this._mainEventBus.emit('currentStepChanged', stepNumber);
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

    get climate() {
        return this._climate;
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

    _deleteColony(colony) {
        let index = this._colonies.indexOf(colony);
        if (index != -1) {
            this._colonies.splice(index, 1);
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

    isAnyColonyByOwnerId(ownerId) {
        return this._colonies.some(colony => colony.ownerId == ownerId);
    }

    isAnyAntByOwnerId(ownerId) {
        return this._entities.some(entity => entity.type == EntityTypes.ANT && entity.ownerId == ownerId);
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

    _onEntityDied(entity) {
        this.deleteEntity(entity.id);
    }

    _onColonyDied(colony) {
        this._deleteColony(colony);
    }

}

export { World }