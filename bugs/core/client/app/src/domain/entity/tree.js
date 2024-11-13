import { Entity } from './entity';
import { EntityTypes } from '@domain/enum/entityTypes';

class Tree extends Entity {

    constructor(eventBus, id, position, angle, fromColony, ownerId, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.TREE, fromColony, ownerId, hp, maxHp);
    }
}

export {
    Tree
}