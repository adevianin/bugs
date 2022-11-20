import { Entity } from './entity';

class Town extends Entity {

    constructor(mainEventBus, id, pos, size) {
        super(mainEventBus, id, pos, size);
    }
}

export {
    Town
}
