import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';

class FoodSource extends Entity {
    constructor(eventBus, id, position, foodType) {
        super(eventBus, id, position, EntityTypes.FOOD_SOURCE, null, null, null);
        this.foodType = foodType;
    }
}

export {
    FoodSource
}