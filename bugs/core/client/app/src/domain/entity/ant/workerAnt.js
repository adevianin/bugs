import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WorkerAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome) {
        super(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome);
    }

}

export {
    WorkerAnt
}