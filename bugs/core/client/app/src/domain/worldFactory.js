import { EntityTypes } from './enum/entityTypes';
import { Ant } from './entity/ant';
import { World } from './entity/world';
import { Nest } from './entity/nest';
import { Food } from './entity/food';
import { FoodArea } from './entity/foodArea';
import { Larva } from './entity/larva';
import { Colony } from './entity/colony';
import { FoodSource } from './entity/foodSource';

class WorldFactory {

    constructor(mainEventBus, nestApi) {
        this._mainEventBus = mainEventBus;
        this._nestApi = nestApi;
    }

    buildWorld() {
        return new World(this._mainEventBus);
    }

    buildAnt(id, antType, position, fromColony, pickedFoodId, userSpeed, locatedInNestId, hp, maxHp) {
        return new Ant(this._mainEventBus, id, antType, position, fromColony, pickedFoodId, userSpeed, locatedInNestId, hp, maxHp);
    }

    buildNest(id, position, fromColony, storedCalories, larvaeData, larvaPlacesCount, isBuilt, hp, maxHp) {
        let larvae = [];
        larvaeData.forEach(larvaData => larvae.push(Larva.fromJson(larvaData.ant_type, larvaData.progress)));
        return new Nest(this._mainEventBus, this._nestApi, id, position, fromColony, storedCalories, larvae, larvaPlacesCount, isBuilt, hp, maxHp);
    }

    buildFood(id, position, calories, food_type, food_varity, is_picked) {
        return new Food(this._mainEventBus, id, position, calories, food_type, food_varity, is_picked);
    }

    buildFoodArea(id, position) {
        return new FoodArea(this._mainEventBus, id, position);
    }

    buildFoodSource(id, position, foodType) {
        return new FoodSource(this._mainEventBus, id, position, foodType);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT:
                return this.buildAnt(entityJson.id, entityJson.ant_type, entityJson.position, entityJson.from_colony, entityJson.picked_food_id, entityJson.user_speed, entityJson.located_in_nest_id, entityJson.hp, entityJson.max_hp);
            case EntityTypes.NEST:
                return this.buildNest(entityJson.id, entityJson.position, entityJson.from_colony, entityJson.stored_calories, entityJson.larvae, entityJson.larva_places_count, entityJson.is_built, entityJson.hp, entityJson.max_hp);
            case EntityTypes.FOOD:
                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories, entityJson.food_type, entityJson.food_variety, entityJson.is_picked);
            case EntityTypes.FOOD_AREA:
                return this.buildFoodArea(entityJson.id, entityJson.position);
            case EntityTypes.FOOD_SOURCE:
                return this.buildFoodSource(entityJson.id, entityJson.position, entityJson.food_type);
            default:
                throw 'unknown type of entity';
        }
    }

    buildColony(id, owner_id, operations) {
        return new Colony(id, owner_id, operations);
    }
}

export { 
    WorldFactory
}