import { EntityTypes } from '../enum/entityTypes';
import { LiveEntity } from './liveEntity';

class GroundBeetle extends LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.GROUND_BEETLE, fromColony, null, userSpeed, hp, maxHp);

        this._setState('standing');
    }

    _playEntityDied(action) {
        this._setState('dead');
        this.die();
        return Promise.resolve();
    }
}

export {
    GroundBeetle
}