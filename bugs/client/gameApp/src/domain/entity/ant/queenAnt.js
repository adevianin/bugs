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
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                this._playFlyNuptialFlight(action);
                return true;
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK:
                this._playFlyNuptialFlightBack(action);
                return true;
            case ACTION_TYPES.ANT_GOT_FERTILIZED:
                this._playGotFertilized(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playFlyNuptialFlight(action) {
        this._requestActionAnimation(ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT, {
            startPosition: this.position,
            isBornInNuptialFlight: action.isBornInNuptialFlight
        });
        this.isInNuptialFlight = true;
        this._emitToEventBus('queenFlewNuptialFlight');
    }

    _playFlyNuptialFlightBack(action) {
        this._requestActionAnimation(ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK, {
            landingPosition: action.landingPosition
        });
        this.setPosition(action.landingPosition.x, action.landingPosition.y)
        this.isInNuptialFlight = false;
        this._emitToEventBus('queenFlewNuptialFlightBack');
    }

    _playGotFertilized(action) {
        this.isFertilized = true;
        this._breedingMaleGenome = Genome.buildFromJson(action.breedingMaleGenome);
    }
}

export {
    QueenAnt
}