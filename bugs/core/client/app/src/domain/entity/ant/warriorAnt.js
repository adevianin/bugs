import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WarriorAnt extends BaseAnt {

    constructor(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep) {
        super(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.WARRIOR, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
    }
}

export {
    WarriorAnt
}