import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class QueenAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, isInNuptialFlight) {
        super(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats);
        this._isFertilized = isFertilized;
        this.isInNuptialFlight = isInNuptialFlight;
    }

    updateIsHidden() {
        this.isHidden = this.isInNest || this.isInNuptialFlight;
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

    _getInNuptialFlight() {
        this.isInNuptialFlight = true;
        this._emitToEventBus('antFlewNuptialFlight')
    }

    _playFlyNuptialFlight() {
        return super._playFlyNuptialFlight().then(() => this._getInNuptialFlight());
    }
}

export {
    QueenAnt
}