import { Entity } from './entity';

class Food extends Entity {
    constructor(mainEventBus, id, pos, size, calories) {
        super(mainEventBus, id, pos, size);
        this._calories = calories;
    }

    updateEntity(entityJson) {
        if (entityJson.eaten) {
            this._mainEventBus.emit('eaten', this)
        }
    }
}

export {
    Food
}