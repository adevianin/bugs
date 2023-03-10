import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Town extends Entity {

    constructor(eventBus, id, position, color) {
        super(eventBus, id, position, EntityTypes.TOWN);
        this._color = color
    }

    get color() {
        return this._color
    }

}

export {
    Town
}
