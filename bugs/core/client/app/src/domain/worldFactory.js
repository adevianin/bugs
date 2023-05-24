import { EntityTypes } from './enum/entityTypes';
import { Ant } from './entity/ant';
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

    buildAnt(id, position, pickedFoodId, userSpeed) {
        return new Ant(this.mainEventBus, id, position, pickedFoodId, userSpeed);
    }

    buildTown(id, position, ownerId, storedCalories, larvaeData, larvaPlacesCount) {
        let larvae = [];
        larvaeData.forEach(larvaData => larvae.push(this._buildLarva(larvaData)));
        return new Town(this.mainEventBus, id, position, ownerId, storedCalories, larvae, larvaPlacesCount);
    }

    buildFood(id, position, calories, food_type, food_varity) {
        return new Food(this.mainEventBus, id, position, calories, food_type, food_varity);
    }

    buildFoodArea(id, position) {
        return new FoodArea(this.mainEventBus, id, position);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT:
                return this.buildAnt(entityJson.id, entityJson.position, entityJson.picked_food_id, entityJson.user_speed);
            case EntityTypes.TOWN:
                return this.buildTown(entityJson.id, entityJson.position, entityJson.owner_id, entityJson.stored_calories, entityJson.larvae, entityJson.larva_places_count);
            case EntityTypes.FOOD:
                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories, entityJson.food_type, entityJson.food_variety);
            case EntityTypes.FOOD_AREA:
                return this.buildFoodArea(entityJson.id, entityJson.position);
            default:
                throw 'unknown type of entity';
        }
    }

    _buildLarva(larvaData) {
        return {
            progress: larvaData.progress,
            antType: larvaData.ant_type
        }
    }
}

export { 
    WorldFactory
}