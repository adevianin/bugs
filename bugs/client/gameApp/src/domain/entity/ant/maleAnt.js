import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";
import { ACTION_TYPES } from "../action/actionTypes";

class MaleAnt extends BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, 
        genome, birthStep, currentActivity, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.MALE, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
    }

    get canFlyNuptialFlight() {
        return true;
    }

    get canBeCooperative() {
        return false;
    }

    get canBeGuardian() {
        return false;
    }

    get isVisible() {
        return super.isVisible && !this._isInNuptialFlight;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                this._playFlyNuptialFlight(action);
                return true;
            default:
                throw 'unknown type of action'
        }
    }

    _playFlyNuptialFlight() {
        this._requestActionAnimation(ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT, {
            startPosition: this.position
        });
        this.isInNuptialFlight = true;
    }

}

export {
    MaleAnt
}