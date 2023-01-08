import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Food extends Entity {
    constructor(mainEventBus, id, pos, size, calories) {
        super(mainEventBus, id, pos, size, EntityTypes.FOOD);
        this._calories = calories;
    }

    updateEntity(entityJson) {
        // if (entityJson.eaten) {
        //     this._mainEventBus.emit('eaten', this)
        // }
    }
}

export {
    Food
}