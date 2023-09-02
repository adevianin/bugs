import { LiveEntity } from './liveEntity'; 
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Ant extends LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, antType, pickedItemId, locatedInNestId) {
        super(eventBus, id, position, angle, EntityTypes.ANT, fromColony, userSpeed, hp, maxHp);
        this._pickedItemId = pickedItemId;
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

    get pickedItemId() {
        return this._pickedItemId;
    }

    set pickedItemId(itemId) {
        this._pickedItemId = itemId;
    }

    hasPickedItem() {
        return !!this._pickedItemId;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ANT_PICKED_UP_ITEM:
                return this._playItemPickingAction(action);
            case ACTION_TYPES.ANT_DROPPED_PICKED_ITEM:
                return this._playItemDroped(action);
            // case ACTION_TYPES.ENTITY_EAT_FOOD:
            //     return this._playEatFoodAction(action);
            case ACTION_TYPES.ENTITY_GOT_IN_NEST:
                return this._playGotInNest(action);
            case ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST:
                return this._playGotOutOfNest(action);
        }
    }

    _playItemPickingAction(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedItemId = action.actionData.item_id;
            this.emit('itemPickedUp');
            res();
        });
    }

    _playItemDroped(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedItemId = null;
            this.emit('itemDroped')
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