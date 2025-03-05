import { BaseAnt } from "./baseAnt";
import { AntTypes } from "@domain/enum/antTypes";
import { ACTION_TYPES } from "../action/actionTypes";
import { Genome } from "../genetic/genome";

class QueenAnt extends BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity, isFertilized, isInNuptialFlight, breedingMaleGenome) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
        this._isFertilized = isFertilized;
        this._isInNuptialFlight = isInNuptialFlight;
        this._breedingMaleGenome = breedingMaleGenome;
    }

    get isVisible() {
        return super.isVisible && !this._isInNuptialFlight;
    }

    set isFertilized(val) {
        this._isFertilized = val;
    }

    get isFertilized() {
        return this._isFertilized;
    }

    get breedingMaleGenome() {
        return this._breedingMaleGenome;
    }

    get isQueenOfColony() {
        return this._isFertilized;
    }

    get canFlyNuptialFlight() {
        return !this.isQueenOfColony;
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
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK:
                return this._playFlyNuptialFlightBack(action)
            case ACTION_TYPES.ANT_GOT_FERTILIZED:
                return this._playGotFertilized(action)
        }
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

    _playGotFertilized(action) {
        this.isFertilized = true;
        this._breedingMaleGenome = Genome.buildFromJson(action.breedingMaleGenome);
        return Promise.resolve();
    }
}

export {
    QueenAnt
}