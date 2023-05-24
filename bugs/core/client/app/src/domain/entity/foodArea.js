import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';

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