import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';

class FoodArea extends Entity {
    constructor(eventBus, id, position, hp, maxHp) {
        super(eventBus, id, position, EntityTypes.FOOD_AREA, null, hp, maxHp);
    }

    updateEntity(entityJson) {
    }
}

export {
    FoodArea
}