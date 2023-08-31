import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';

class ItemArea extends Entity {
    constructor(eventBus, id, position, hp, maxHp) {
        super(eventBus, id, position, EntityTypes.ITEM_AREA, null, hp, maxHp);
    }
}

export {
    ItemArea
}