import { EntityTypes } from '@domain/enum/entityTypes';

class WorldService {

    constructor(world, worldFactory, mainEventBus, ratingContainer) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._worldSize = null;
        this._ratingContainer = ratingContainer;

        this._mainEventBus.on('entityDied', this._onEntityDied.bind(this));
    }

    get world() {
        return this._world;
    }

    get ratingContainer() {
        return this._ratingContainer;
    }

    setCurrentStep(currentStep, currentSeason) {
        this._world.currentStep = currentStep;
        this._world.currentSeason = currentSeason;
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
                actor.playAction(action);
        }
    }

    playClimateAction(action) {
        this._world.climate.playAction(action);
    }

    initWorld(worldJson, step, season) {
        let entities = [];
        worldJson.entities.forEach(entityJson => { 
            let entity = this._worldFactory.buildEntity(entityJson);
            entities.push(entity);
        });
        
        let colonies = [];
        worldJson.ant_colonies.forEach(colonyJson => {
            let colony = this._worldFactory.buildAntColony(colonyJson.id, colonyJson.owner_id, colonyJson.name, colonyJson.operations);
            colonies.push(colony);
        });
        
        this._world.initWorld(worldJson.size, entities, colonies, worldJson.climate, step, season);
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
        switch (entity.type) {
            case EntityTypes.ANT:
                this._mainEventBus.emit('antBorn', entity);
                this._mainEventBus.emit(`antBorn:${entity.fromColony}`, entity);
                break;
            case EntityTypes.NEST:
                this._mainEventBus.emit('nestBorn', entity);
                this._mainEventBus.emit(`nestBorn:${entity.fromColony}`, entity);
                break;
        }
    }

    _onEntityDied(entity) {
        this._world.deleteEntity(entity);
        switch (entity.type) {
            case EntityTypes.ANT:
                this._mainEventBus.emit('antDied', entity);
                this._mainEventBus.emit(`antDied:${entity.fromColony}`, entity);
                break;
            case EntityTypes.NEST:
                this._mainEventBus.emit('nestDied', entity);
                this._mainEventBus.emit(`nestDied:${entity.fromColony}`, entity);
                break;
        }
    }

}

export {
    WorldService
};