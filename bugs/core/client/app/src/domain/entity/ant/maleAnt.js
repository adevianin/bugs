import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class MaleAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        super(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, AntTypes.MALE, pickedItemId, locatedInNestId, homeNestId, stats);
    }
}

export {
    MaleAnt
}