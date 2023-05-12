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

    buildWorld() {
        return new World(this.mainEventBus);
    }

    buildBug(id, position, pickedFoodId) {
        return new Bug(this.mainEventBus, id, position, pickedFoodId);
    }

    buildTown(id, position, color) {
        return new Town(this.mainEventBus, id, position, color);
    }

    buildFood(id, position, calories, food_type, food_varity) {
        return new Food(this.mainEventBus, id, position, calories, food_type, food_varity);
    }

    buildFoodArea(id, position) {
        return new FoodArea(this.mainEventBus, id, position);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.BUG:
                return this.buildBug(entityJson.id, entityJson.position, entityJson.picked_food_id);
            case EntityTypes.TOWN:
                return this.buildTown(entityJson.id, entityJson.position, entityJson.color);
            case EntityTypes.FOOD:
                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories, entityJson.food_type, entityJson.food_variety);
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