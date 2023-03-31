import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Food extends Entity {
    constructor(eventBus, id, position, calories) {
        super(eventBus, id, position, EntityTypes.FOOD);
        this.calories = calories;
    }

    updateEntity(entityJson) {
    }
}

export {
    Food
}