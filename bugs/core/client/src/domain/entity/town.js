import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Town extends Entity {

    constructor(mainEventBus, id, pos, size, color) {
        super(mainEventBus, id, pos, size, EntityTypes.TOWN);
        this._color = color
    }

    getColor() {
        return this._color
    }
}

export {
    Town
}
