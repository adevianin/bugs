import { Entity } from './entity';

class Town extends Entity {

    constructor(mainEventBus, id, pos, size, color) {
        super(mainEventBus, id, pos, size);
        this._color = color
    }

    getColor() {
        return this._color
    }
}

export {
    Town
}
