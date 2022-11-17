import { Entity } from './entity';

class Food extends Entity {
    constructor(id, pos, size, calories) {
        super(id, pos, size);
        this._calories = calories;
    }
}

export {
    Food
}