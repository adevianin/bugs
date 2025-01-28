import { EntityTypes } from '../enum/entityTypes';
import { LiveEntity } from './liveEntity';

class Ladybug extends LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, isInHibernation) {
        super(eventBus, id, position, angle, EntityTypes.LADYBUG, fromColony, null, hp, maxHp, isInHibernation);

        this._setState('standing');
    }

}

export {
    Ladybug
}