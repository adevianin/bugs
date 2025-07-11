import { EntityTypes } from '@domain/enum/entityTypes';

class WorldService {

    constructor(world, worldFactory, mainEventBus) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._worldSize = null;
        this._rating = null;

        this._mainEventBus.on('entityDied', this._onEntityDied.bind(this));
    }

    get world() {
        return this._world;
    }

    setCurrentStep(currentStep, currentSeason) {
        this._world.currentStep = currentStep;
        this._world.currentSeason = currentSeason;
    }

    initRating(rating) {
        this._rating = rating;
    }

    getRating() {
        return this._rating;
    }

    playRatingAction(ratingAction) {
        this._rating = ratingAction.ratingPlaces;
        this._mainEventBus.emit('ratingUpdated');
    }

    playEntityAction(action) {
        switch(action.type) {
            case 'entity_born':
                this.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this.world.findEntityById(action.actorId);
                if (actor) {
                    actor.playAction(action);
                } else {
                    console.warn(`actor id=${action.actorId} not found.`, action);
                }
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
            let colony = this._worldFactory.buildAntColony(colonyJson);
            colonies.push(colony);
        });
        
        this._world.initWorld(worldJson.size, entities, colonies, worldJson.climate, step, season);
    }

    getColoniesByIds(ids) {
        let foundColonies = [];
        for (let colony of this._world.colonies) {
            if (ids.includes(colony.id)) {
                foundColonies.push(colony);
            }
        }

        return foundColonies;
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
        switch (entity.type) {
            case EntityTypes.ANT:
                this._mainEventBus.emit('antBorn', entity);
                break;
            case EntityTypes.NEST:
                this._mainEventBus.emit('nestBorn', entity);
                break;
        }
    }

    _onEntityDied(entity) {
        this._world.deleteEntity(entity);
        switch (entity.type) {
            case EntityTypes.ANT:
                this._mainEventBus.emit('antDied', entity);
                break;
            case EntityTypes.NEST:
                this._mainEventBus.emit('nestDied', entity);
                break;
        }
    }

}

export {
    WorldService
};