import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";
import { ACTION_TYPES } from "../action/actionTypes";

class QueenAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, isFertilized, isInNuptialFlight, genes) {
        super(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome);
        this._isFertilized = isFertilized;
        this.isInNuptialFlight = isInNuptialFlight;
        this._genes = genes;
    }

    updateIsHidden() {
        this.isHidden = this.isInNest || this.isInNuptialFlight;
    }

    set isFertilized(val) {
        this._isFertilized = val;
    }

    get isFertilized() {
        return this._isFertilized;
    }

    set isInNuptialFlight(isInNuptialFlight) {
        this._isInNuptialFlight = isInNuptialFlight;
        this.updateIsHidden();
    }

    get isInNuptialFlight() {
        return this._isInNuptialFlight;
    }

    get canFlyNuptialFlight() {
        return !this._isFertilized;
    }

    get genes() {
        return this._genes;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                return this._playFlyNuptialFlight(action)
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK:
                return this._playFlyNuptialFlightBack(action)
            case ACTION_TYPES.ANT_GOT_FERTILIZED:
                return this._playGotFertilized(action)
        }
    }

    flyNuptialFlight() {
        this._antApi.flyNuptialFlight(this.id);
    }

    _playFlyNuptialFlight() {
        return this._flyAwayAnimation().then(() => {
            this.isInNuptialFlight = true;
            this._emitToEventBus('queenFlewNuptialFlight');
        });
    }

    _playFlyNuptialFlightBack(action) {
        let landPos = action.landingPosition;
        this.setPosition(landPos.x, landPos.y)
        this.isInNuptialFlight = false;
        this._emitToEventBus('queenFlewNuptialFlightBack');
        return Promise.resolve();
    }

    _playGotFertilized() {
        this.isFertilized = true;
        return Promise.resolve();
    }
}

export {
    QueenAnt
}