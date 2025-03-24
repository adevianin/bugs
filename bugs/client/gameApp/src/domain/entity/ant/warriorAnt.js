import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class WarriorAnt extends BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.WARRIOR, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
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
    WarriorAnt
}