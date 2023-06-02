import { AntTypes } from "../enum/antTypes";
import { EntityTypes } from "../enum/entityTypes";

class WorldService {

    constructor(world, worldFactory, mainEventBus) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._isWholeWorldInited = false;
        this._worldSize = null;
    }

    get world() {
        return this._world;
    }

    get is_world_inited() {
        return this._isWholeWorldInited;
    }

    initWorld(worldJson) {
        worldJson.entities.forEach(entityJson => { 
            let entity = this._worldFactory.buildEntity(entityJson);
            this._world.addEntity(entity); 
        });
        this._world.size = worldJson.size;

        this._isWholeWorldInited = true;
        this._mainEventBus.emit('wholeWorldInited');
    }

    getEntities() {
        return this._world.entities;
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
    }

    clear() {
        this._world.clear();
        this._isWholeWorldInited = false;
    }

    isWholeWorldInited() {
        return this._isWholeWorldInited;
    }

    findMyQueen(userId) {
        return this._world.entities.find(e => { 
            return e.type == EntityTypes.ANT && e.antType == AntTypes.QUEEN && e.ownerId == userId;
        });
    }

}

export {
    WorldService
};