import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';

class ItemArea extends Entity {
    constructor(eventBus, id, position, angle, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.ITEM_AREA, null, hp, maxHp);
    }
}

export {
    ItemArea
}