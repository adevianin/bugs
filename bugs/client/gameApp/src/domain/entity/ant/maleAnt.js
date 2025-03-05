import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";
import { ACTION_TYPES } from "../action/actionTypes";

class MaleAnt extends BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.MALE, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
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

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                return this._playFlyNuptialFlight(action)
        }
    }

    _playFlyNuptialFlight() {
        return this._flyAwayAnimation().then(() => {
            this.isInNuptialFlight = true;
        });
    }

    _playEntityDied(action) {
        if (this.isInNuptialFlight) {
            this.die();
            return Promise.resolve();
        } else {
            return super._playEntityDied(action);
        }
    }
}

export {
    MaleAnt
}