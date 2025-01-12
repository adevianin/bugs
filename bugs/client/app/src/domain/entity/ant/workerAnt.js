import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WorkerAnt extends BaseAnt {

    constructor(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity) {
        super(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
    }

}

export {
    WorkerAnt
}