import { EntityTypes } from '../enum/entityTypes';
import { LiveEntity } from './liveEntity';

class Ladybug extends LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.LADYBUG, fromColony, null, userSpeed, hp, maxHp);

        this._setState('standing');
    }

}

export {
    Ladybug
}