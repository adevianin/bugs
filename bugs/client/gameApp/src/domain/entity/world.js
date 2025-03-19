import { EntityTypes } from "../enum/entityTypes";
import { CONSTS } from "@domain/consts";

class World {
    constructor(mainEventBus, climate) {
        this._mainEventBus = mainEventBus;
        this._entities = [];
        this._colonies = [];
        this._climate = climate;
        this._currentStep = 0;
        this._currentSeason = null;
    }

    get currentStep() {
        return this._currentStep;
    }

    set currentStep(stepNumber) {
        this._currentStep = stepNumber;
        this._mainEventBus.emit('currentStepChanged', stepNumber);
    }

    get currentSeason() {
        return this._currentSeason
    }

    set currentSeason(season) {
        let oldSeasonValue = this._currentSeason;
        this._currentSeason = season;
        if (oldSeasonValue != season) {
            this._mainEventBus.emit('currentSeasonChanged', season);
        }
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

    get isNuptialSeasonNow() {
        return CONSTS.NUPTIAL_FLIGHT_SEASONS.indexOf(this.currentSeason) != -1;
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

    deleteEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (index != -1) {
            this._entities.splice(index, 1);
        }
    }

    addColony(colony) {
        this._colonies.push(colony);
    }

    deleteColony(colony) {
        let index = this._colonies.indexOf(colony);
        if (index != -1) {
            this._colonies.splice(index, 1);
        }
    }

    findEntityByType(type) {
        return this._entities.filter(e => e.type == type);
    }

    findEntityById(id) {
        return this._entities.find( entity => entity.id == id);
    }

    findColonyById(id) {
        return this._colonies.find( colony => colony.id == id);
    }

    isAnyColonyByOwnerId(ownerId) {
        return this._colonies.some(colony => colony.ownerId == ownerId);
    }

    isAnyAntByOwnerId(ownerId) {
        return this._entities.some(entity => entity.type == EntityTypes.ANT && entity.ownerId == ownerId);
    }

    findAntsFromColony(colonyId) {
        return this._entities.filter(e => e.type == EntityTypes.ANT && e.fromColony == colonyId);
    }

    findColonyByOwnerId(ownerId) {
        return this._colonies.find(colony => colony.ownerId == ownerId);
    }

    findColoniesByOwnerId(ownerId) {
        return this._colonies.filter(colony => colony.ownerId == ownerId);
    }

    findNestsFromColony(colonyId) {
        return this._entities.filter(e => e.type == EntityTypes.NEST && e.fromColony == colonyId);
    }

    findNestsByOwner(ownerId) {
        return this._entities.filter(e => e.type == EntityTypes.NEST && e.ownerId == ownerId);
    }

    getQueenOfColony(colonyId) {
        let ants = this.findAntsFromColony(colonyId);
        for (let ant of ants) {
            if (ant.isQueenOfColony) {
                return ant;
            }
        }

        return null;
    }

    getMainNestOfColony(colonyId) {
        let nests = this.findNestsFromColony(colonyId);
        return nests.find(nest => nest.isMain);
    }

    getSubNestsOfColony(colonyId) {
        let nests = this.findNestsFromColony(colonyId);
        return nests.filter(nest => !nest.isMain);
    }

}

export { World }