import { EntityTypes } from '../enum/entityTypes';
import { LiveEntity } from './liveEntity';

class GroundBeetle extends LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.GROUND_BEETLE, fromColony, userSpeed, hp, maxHp);

        this._setState('standing');
    }
}

export {
    GroundBeetle
}