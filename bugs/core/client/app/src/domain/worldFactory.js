import { EntityTypes } from './enum/entityTypes';
import { Ant } from './entity/ant';
import { World } from './entity/world';
import { Town } from './entity/town';
import { Food } from './entity/food';
import { FoodArea } from './entity/foodArea';
import { Larva } from './entity/larva';

class WorldFactory {

    constructor(mainEventBus, townApi) {
        this._mainEventBus = mainEventBus;
        this._townApi = townApi;
    }

    buildWorld() {
        return new World(this._mainEventBus);
    }

    buildAnt(id, antType, position, pickedFoodId, userSpeed) {
        return new Ant(this._mainEventBus, id, antType, position, pickedFoodId, userSpeed);
    }

    buildTown(id, position, ownerId, storedCalories, larvaeData, larvaPlacesCount) {
        let larvae = [];
        larvaeData.forEach(larvaData => larvae.push(Larva.fromJson(larvaData.ant_type, larvaData.progress)));
        return new Town(this._mainEventBus, this._townApi, id, position, ownerId, storedCalories, larvae, larvaPlacesCount);
    }

    buildFood(id, position, calories, food_type, food_varity) {
        return new Food(this._mainEventBus, id, position, calories, food_type, food_varity);
    }

    buildFoodArea(id, position) {
        return new FoodArea(this._mainEventBus, id, position);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT:
                return this.buildAnt(entityJson.id, entityJson.ant_type, entityJson.position, entityJson.picked_food_id, entityJson.user_speed);
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
}

export { 
    WorldFactory
}