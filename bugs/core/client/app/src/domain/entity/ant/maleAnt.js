import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";
import { ACTION_TYPES } from "../action/actionTypes";

class MaleAnt extends BaseAnt {

    constructor(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep) {
        super(eventBus, antApi, id, name, position, angle, fromColony, ownerId, hp, maxHp, AntTypes.MALE, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
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

    flyNuptialFlight() {
        this._antApi.flyNuptialFlight(this.id);
    }

    _playFlyNuptialFlight() {
        return this._flyAwayAnimation().then(() => {
            this.isHidden = true;
        });
    }

    _playEntityDied(action) {
        if (this.isHidden) {
            this.die();
            return Promise.resolve();
        } else {
            super._playEntityDied(action);
        }
    }
}

export {
    MaleAnt
}