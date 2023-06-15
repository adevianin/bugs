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
        
        worldJson.colonies.forEach(colonyJson => {
            let colony = this._worldFactory.buildColony(colonyJson.id, colonyJson.owner_id, colonyJson.operations);
            this._world.addColony(colony);
        });
        
        this._world.size = worldJson.size;

        this._isWholeWorldInited = true;

        this._mainEventBus.emit('wholeWorldInited');
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
    }

    updateColony(colonyJson) {
        let colony = this._world.findColonyById(colonyJson.id);
        colony.setOperations(colonyJson.operations);
    }

    clear() {
        this._world.clear();
        this._isWholeWorldInited = false;
    }

    isWholeWorldInited() {
        return this._isWholeWorldInited;
    }

}

export {
    WorldService
};