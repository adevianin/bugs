import { EntityTypes } from "../enum/entityTypes";
import { CONSTS } from "@domain/consts";
import { Chunk } from "./chunk";
import { distance_point } from "@utils/distance";
import { SEASON_TYPES } from "@domain/enum/season_types";

class World {
    constructor(mainEventBus, climate) {
        this._mainEventBus = mainEventBus;
        this._entities = [];
        this._colonies = [];
        this._climate = climate;
        this._currentStep = 0;
        this._currentSeason = null;
        this._size = null;
        this._chunks = {};

        this._mainEventBus.on('entityMoved', this._onEntityMoved.bind(this));
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

    get colonies() {
        return [...this._colonies];
    }

    get size() {
        return this._size;
    }

    get climate() {
        return this._climate;
    }

    get chunks() {
        return this._chunks;
    }

    initWorld(size, entities, colonies, climate, stepNumber, season) {
        this._size = size;
        this._entities = entities;
        this._entitiesByIds = {};
        this._colonies = colonies;
        this._climate.setTemperatureChange(climate.dailyTemperature, climate.directionOfChange);
        this._currentStep = stepNumber;
        this._currentSeason = season;

        this._splitOnChunks();
        this._addAllEntitiesToChunks();
        this._addAllEntitiesToIds();
    }

    getAnts() {
        return this.findEntityByType(EntityTypes.ANT);
    }

    getNests() {
        return this.findEntityByType(EntityTypes.NEST);
    }

    addEntity(entity) {
        this._entities.push(entity);
        this._addEntityToChunks(entity);
        this._addEntityToIds(entity);
    }

    deleteEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (index != -1) {
            this._entities.splice(index, 1);
        }
        this._removeEntityFromChunks(entity);
        this._removeEntityFromIds(entity);
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
        return this._entitiesByIds[id];
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

    findAntsByOwnerId(ownerId) {
        return this._entities.filter(entity => entity.type == EntityTypes.ANT && entity.ownerId == ownerId);
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

    getEntitiesFromChunks(chunkIds) {
        let entities = [];
        for (let chunkId of chunkIds) {
            entities = entities.concat(this._chunks[chunkId].entities);
        }

        return entities;
    }

    getEntitiesNear(position, radius) {
        let searchRect = { 
            x: position.x - radius, 
            y: position.y - radius, 
            width: 2*radius, 
            height: 2*radius 
        };
        let seacrhingChunkIds = [];
        for (let chunkId in this._chunks) {
            let chunk = this._chunks[chunkId];
            if (chunk.intersectsRect(searchRect.x, searchRect.y, searchRect.width, searchRect.height)) {
                seacrhingChunkIds.push(chunkId);
            }
        }

        let entities = this.getEntitiesFromChunks(seacrhingChunkIds);
        let foundEntities = [];
        for (let entity of entities) {
            if (distance_point(entity.position, position) <= radius) {
                foundEntities.push(entity);
            }
        }

        return foundEntities;
    }

    _splitOnChunks() {
        let rowsCount = Math.ceil(this._size[1] / CONSTS.VIEW_CHUNK_SIZE[1]);
        let colsCount = Math.ceil(this._size[0] / CONSTS.VIEW_CHUNK_SIZE[0]);

        for (let chunkColIndex = 0; chunkColIndex < colsCount; chunkColIndex++) {
            for (let chunkRowIndex = 0; chunkRowIndex < rowsCount; chunkRowIndex++) {
                let chunkX = chunkColIndex * CONSTS.VIEW_CHUNK_SIZE[0];
                let chunkY = chunkRowIndex * CONSTS.VIEW_CHUNK_SIZE[1];
                let chunkId = `${chunkColIndex}_${chunkRowIndex}`;
                this._chunks[chunkId] = new Chunk(chunkX, chunkY, CONSTS.VIEW_CHUNK_SIZE[0], CONSTS.VIEW_CHUNK_SIZE[1]);
            }
        }
    }

    _addAllEntitiesToChunks() {
        for (let entity of this._entities) {
            this._addEntityToChunks(entity);
        }
    }

    _addEntityToChunks(entity) {
        let chunkId = this._calcChunkIdForPosition(entity.position);
        let chunk = this._chunks[chunkId];
        chunk.addEntity(entity);
        entity.chunkId = chunkId;
    }

    _removeEntityFromChunks(entity) {
        let chunk = this._chunks[entity.chunkId];
        chunk.removeEntity(entity);
        entity.chunkId = null;
    }

    _addAllEntitiesToIds() {
        for (let entity of this._entities) {
            this._addEntityToIds(entity);
        }
    }

    _addEntityToIds(entity) {
        this._entitiesByIds[entity.id] = entity;
    }

    _removeEntityFromIds(entity) {
        delete this._entitiesByIds[entity.id];
    }

    _onEntityMoved(entity) {
        let newChunkId = this._calcChunkIdForPosition(entity.position);
        if (entity.chunkId != newChunkId) {
            let oldChunk = this._chunks[entity.chunkId];
            oldChunk.removeEntity(entity);
            let newChunk = this._chunks[newChunkId];
            newChunk.addEntity(entity);
            entity.chunkId = newChunkId;
        }
    }

    _calcChunkIdForPosition({x, y}) {
        let first = Math.floor(x / CONSTS.VIEW_CHUNK_SIZE[0]);
        let second = Math.floor(y / CONSTS.VIEW_CHUNK_SIZE[1]);
        return `${first}_${second}`;
    }
}

export { World }