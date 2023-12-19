import { AntTypes } from "../enum/antTypes";
import { EntityTypes } from "../enum/entityTypes";
import { distance } from '@utils/distance';

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

    clear() {
        this._world.clear();
        this._isWholeWorldInited = false;
    }

    isWholeWorldInited() {
        return this._isWholeWorldInited;
    }

    findNearestNestForOffensiveOperation(point, excludeColonyId) {
        let nests = this._world.getNests();
        let nearestNest = null;
        let smallestDistance = null;
        let maxDist = 100;

        nests.forEach(nest => {
            let dist = distance(point.x, point.y, nest.position.x, nest.position.y);
            if (nest.fromColony != excludeColonyId && dist <= maxDist && (!smallestDistance || dist < smallestDistance)) {
                smallestDistance = dist;
                nearestNest = nest;
            }
        });

        return nearestNest;
    }

    findMyNearestNestForOperation(point, myColonyId) {
        let nests = this._world.getNests();
        let nearestNest = null;
        let smallestDistance = null;
        let maxDist = 100;

        nests.forEach(nest => {
            let dist = distance(point.x, point.y, nest.position.x, nest.position.y);
            if (nest.fromColony == myColonyId && dist <= maxDist && (!smallestDistance || dist < smallestDistance)) {
                smallestDistance = dist;
                nearestNest = nest;
            }
        });

        return nearestNest;
    }

}

export {
    WorldService
};