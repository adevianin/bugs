import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class FoodArea extends Entity {
    constructor(id, position, calories) {
        super(id, position, EntityTypes.FOOD_AREA);
    }

    updateEntity(entityJson) {
    }
}

export {
    FoodArea
}