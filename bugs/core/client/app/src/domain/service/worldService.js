import { AntTypes } from '@domain/enum/antTypes';
import { distance } from '@utils/distance';

class WorldService {

    constructor(world, worldFactory, mainEventBus, ratingContainer) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._worldSize = null;
        this._ratingContainer = ratingContainer;

        this._mainEventBus.on('userLogout', this._clearWorld.bind(this));
    }

    get world() {
        return this._world;
    }

    get ratingContainer() {
        return this._ratingContainer;
    }

    setCurrentStep(currentStep) {
        this._world.currentStep = currentStep;
    }

    setRating(ratingData) {
        this._ratingContainer.setRatingPlaces(ratingData);
    }

    playRatingAction(ratingAction) {
        this.setRating(ratingAction.ratingPlaces);
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

    playClimateAction(action) {
        this._world.climate.playAction(action);
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

        this._world.climate.setTemperatureChange(worldJson.climate.dailyTemperature, worldJson.climate.directionOfChange);
    }

    _clearWorld() {
        this._world.clear();
        // this._mainEventBus.emit('worldCleared');
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
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
        return allAnts.filter(ant => ant.ownerId == userId && ant.antType == AntTypes.QUEEN && ant.isInNuptialFlight);
    }

}

export {
    WorldService
};