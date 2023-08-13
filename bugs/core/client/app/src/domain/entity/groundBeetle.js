import { EntityTypes } from '../enum/entityTypes';
import { LiveEntity } from './liveEntity';

class GroundBeetle extends LiveEntity {

    constructor(eventBus, id, position, fromColony, userSpeed, hp, maxHp) {
        super(eventBus, id, position, EntityTypes.GROUND_BEETLE, fromColony, userSpeed, hp, maxHp);
    }
}

export {
    GroundBeetle
}