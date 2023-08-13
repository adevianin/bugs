import { LiveEntity } from './liveEntity'; 
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Ant extends LiveEntity {

    constructor(eventBus, id, position, fromColony, userSpeed, hp, maxHp, antType, pickedFoodId, locatedInNestId) {
        super(eventBus, id, position, EntityTypes.ANT, fromColony, userSpeed, hp, maxHp);
        this.pickedFoodId = pickedFoodId;
        this._antType = antType;
        this._setState('standing');
        this._locatedInNestId = locatedInNestId;
    }

    get antType() {
        return this._antType;
    }

    getColor() {
        // return this._homeNest.getColor()
    }

    get isInNest() {
        return !!this._locatedInNestId;
    }

    get locatedInNestId() {
        return this._locatedInNestId;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ANT_PICKED_UP_FOOD:
                return this._playFoodPickingAction(action);
            case ACTION_TYPES.ANT_GAVE_PICKED_FOOD:
                return this._playFoodGiving(action);
            case ACTION_TYPES.ANT_DROPPED_PICKED_FOOD:
                return this._playFoodDrop(action);
            case ACTION_TYPES.ENTITY_EAT_FOOD:
                return this._playEatFoodAction(action);
            case ACTION_TYPES.ENTITY_GOT_IN_NEST:
                return this._playGotInNest(action);
            case ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST:
                return this._playGotOutOfNest(action);
        }
    }

    hasPickedFood() {
        return !!this.pickedFoodId;
    }

    _playFoodPickingAction(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedFoodId = action.actionData.food_id;
            this.emit('foodPickedUp');
            res();
        });
    }

    _playFoodGiving(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedFoodId = null;
            this.emit('foodDroped')
            res();
        });
    }

    _playFoodDrop(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedFoodId = null;
            this.emit('foodDroped')
            res();
        });
    }

    _playEatFoodAction(action) {
        this._setState('standing');
        return Promise.resolve();
    }

    _playGotInNest(action) {
        this._setState('standing');
        this._locatedInNestId = action.actionData.nest_id;
        this.emit('locatedInNestChanged');
        return Promise.resolve();
    }

    _playGotOutOfNest() {
        this._setState('standing');
        this._locatedInNestId = null;
        this.emit('locatedInNestChanged');
        return Promise.resolve();
    }

    _toggleIsInNest(isInNest) {
        this._isInNest = isInNest;
        
    }

}

export { Ant }