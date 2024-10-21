import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WarriorAnt extends BaseAnt {

    constructor(eventBus, antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep) {
        super(eventBus, antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, AntTypes.WARRIOR, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
    }
}

export {
    WarriorAnt
}