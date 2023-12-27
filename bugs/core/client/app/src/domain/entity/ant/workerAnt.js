import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WorkerAnt extends BaseAnt {

    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        super(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats);
    }

}

export {
    WorkerAnt
}