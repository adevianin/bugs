import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WorkerAnt extends BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, 
        birthStep, currentActivity, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            default:
                throw 'unknown type of action';
        }
    }

}

export {
    WorkerAnt
}