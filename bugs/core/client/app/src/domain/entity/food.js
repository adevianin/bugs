import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Food extends Entity {
    constructor(eventBus, id, position, calories, food_type, food_varity) {
        super(eventBus, id, position, EntityTypes.FOOD);
        this.calories = calories;
        this._food_type = food_type;
        this._food_variety = food_varity;
    }

    get food_type() {
        return this._food_type;
    }

    get food_variety() {
        return this._food_variety;
    }

    updateEntity(entityJson) {
    }
}

export {
    Food
}