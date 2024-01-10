import { AntTypes } from '@domain/enum/antTypes';
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

    playEntityAction(action) {
        switch(action.type) {
            case 'entity_born':
                this.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this.world.findEntityById(action.actorId);
                actor.addAction(action);
        }
    }

    initWorld(worldJson) {
        worldJson.entities.forEach(entityJson => { 
            let entity = this._worldFactory.buildEntity(entityJson);
            this._world.addEntity(entity); 
        });
        
        worldJson.ant_colonies.forEach(colonyJson => {
            let colony = this._worldFactory.buildAntColony(colonyJson.id, colonyJson.owner_id, colonyJson.operations, colonyJson.queen_id);
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

    findNearestNestForOffensiveOperation(performingColonyId, point) {
        let nests = this._world.getNests();
        let nearestNest = null;
        let smallestDistance = null;
        let maxDist = 100;

        nests.forEach(nest => {
            let dist = distance(point.x, point.y, nest.position.x, nest.position.y);
            if (nest.fromColony != performingColonyId && dist <= maxDist && (!smallestDistance || dist < smallestDistance)) {
                smallestDistance = dist;
                nearestNest = nest;
            }
        });

        return nearestNest;
    }

    getQueensInNuptialFlightFromUser(userId) {
        let allAnts = this._world.getAnts();
        return allAnts.filter(ant => ant.antType == AntTypes.QUEEN && ant.isInNuptialFlight);
    }

}

export {
    WorldService
};