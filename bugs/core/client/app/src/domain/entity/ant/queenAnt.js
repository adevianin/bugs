import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";

class QueenAnt extends BaseAnt {
    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized) {
        super(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats);
        this._isFertilized = isFertilized;
    }

    get isFertilized() {
        return this._isFertilized;
    }
}

export {
    QueenAnt
}