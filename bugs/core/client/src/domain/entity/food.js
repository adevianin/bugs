import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Food extends Entity {
    constructor(id, position, calories) {
        super(id, position, EntityTypes.FOOD);
        this.calories = calories;
    }

    updateEntity(entityJson) {
    }
}

export {
    Food
}