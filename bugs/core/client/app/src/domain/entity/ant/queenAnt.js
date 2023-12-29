import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class QueenAnt extends BaseAnt {

    constructor(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, isInNuptialFlight) {
        super(eventBus, antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats);
        this._isFertilized = isFertilized;
        this._isInNuptialFlight = isInNuptialFlight;
    }

    get isFertilized() {
        return this._isFertilized;
    }

    get isInNuptialFlight() {
        return this._isInNuptialFlight;
    }

    get canFlyNuptialFlight() {
        return !this._isFertilized;
    }
}

export {
    QueenAnt
}