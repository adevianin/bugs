import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class FoodArea extends Entity {
    constructor(eventBus, id, position, calories) {
        super(eventBus, id, position, EntityTypes.FOOD_AREA);
    }

    updateEntity(entityJson) {
    }
}

export {
    FoodArea
}