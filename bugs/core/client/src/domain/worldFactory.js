import { EntityTypes } from './entity/entityTypes'
import { Bug } from './entity/bug';
import { World } from './entity/world';
import { Town } from './entity/town';
import { Food } from './entity/food';
import { FoodArea } from './entity/foodArea';

class WorldFactory {

    constructor(mainEventBus) {
        this.mainEventBus = mainEventBus;
    }

    buildWorldFromJson(worldJson) {
        let entities = [];
        worldJson.entities.forEach(entityJson => {
            let entity = this.buildEntity(entityJson);
            entities.push(entity);
        });

        let world = this.buildWorld(entities);

        return world;
    }

    buildWorld(entities) {
        return new World(this.mainEventBus, entities);
    }

    buildBug(id, position) {
        return new Bug(this.mainEventBus, id, position);
    }

    buildTown(id, position, color) {
        return new Town(this.mainEventBus, id, position, color);
    }

    buildFood(id, position, calories) {
        return new Food(this.mainEventBus, id, position, calories);
    }

    buildFoodArea(id, position) {
        return new FoodArea(this.mainEventBus, id, position);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.BUG:
                return this.buildBug(entityJson.id, entityJson.position);
            case EntityTypes.TOWN:
                return this.buildTown(entityJson.id, entityJson.position, entityJson.color);
            case EntityTypes.FOOD:
                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories);
            case EntityTypes.FOOD_AREA:
                return this.buildFoodArea(entityJson.id, entityJson.position);
            default:
                throw 'unknown type of entity';
        }
    }
}

export { 
    WorldFactory
}