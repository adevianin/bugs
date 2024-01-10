import { LiveEntity } from '../liveEntity';
import { EntityTypes } from '@domain/enum/entityTypes';
import { ACTION_TYPES } from '../action/actionTypes';

class BaseAnt extends LiveEntity {

    constructor(eventBus, antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, antType, pickedItemId, locatedInNestId, homeNestId, stats) {
        super(eventBus, id, position, angle, EntityTypes.ANT, fromColony, ownerId, userSpeed, hp, maxHp);
        this._pickedItemId = pickedItemId;
        this._antType = antType;
        this._setState('standing');
        this.locatedInNestId = locatedInNestId;
        this._homeNestId = homeNestId;
        this._stats = stats;
        this._antApi = antApi;
    }

    updateIsHidden() {
        this.isHidden = this.isInNest;
    }

    get antType() {
        return this._antType;
    }

    get isInNest() {
        return !!this._locatedInNestId;
    }

    get locatedInNestId() {
        return this._locatedInNestId;
    }

    set locatedInNestId(nestId) {
        this._locatedInNestId = nestId;
        this.updateIsHidden();
    }

    get pickedItemId() {
        return this._pickedItemId;
    }

    set pickedItemId(itemId) {
        this._pickedItemId = itemId;
    }

    get homeNestId() {
        return this._homeNestId;
    }

    get stats() {
        return this._stats;
    }

    hasPickedItem() {
        return !!this._pickedItemId;
    }

    get canFlyNuptialFlight() {
        return false;
    }

    flyNuptialFlight() {
        this._antApi.flyNuptialFlight(this.id);
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
            case ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                return this._playFlyNuptialFlight(action)
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
        this.locatedInNestId = action.actionData.nest_id;
        this.emit('locatedInNestChanged');
        return Promise.resolve();
    }

    _playGotOutOfNest() {
        this._setState('standing');
        this.locatedInNestId = null;
        this.emit('locatedInNestChanged');
        return Promise.resolve();
    }

    // _toggleIsInNest(isInNest) {
    //     this._isInNest = isInNest;
    // }

    _playFlyNuptialFlight(action) {
        let stepCount = 100;
        let stepNumber = 0;
        return new Promise((res) => {
            let rotationInterval = setInterval(()=> {
                this.angle += 20;
                this.setPosition(this._position.x, this._position.y-2);
                stepNumber++;
                if (stepNumber > stepCount) {
                    clearInterval(rotationInterval);
                    res();
                }
            }, 20)
        });
    }

}

export { BaseAnt }