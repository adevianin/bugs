import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WorkerAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        super(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats);
    }

}

export {
    WorkerAnt
}