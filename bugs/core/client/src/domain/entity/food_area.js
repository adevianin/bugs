import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class FoodArea extends Entity {

    constructor(mainEventBus, id, pos, size, foods) {
        super(mainEventBus, id, pos, size, EntityTypes.FOOD_AREA);
        this._foods = foods
    }

    get foods() {
        return [...this._foods]
    }

    updateEntity(entityJson) {
        this._foods = entityJson.foods
    }
}

export {
    FoodArea
}