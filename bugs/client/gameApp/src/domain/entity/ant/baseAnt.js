import { LiveEntity } from '../liveEntity';
import { EntityTypes } from '@domain/enum/entityTypes';
import { ACTION_TYPES } from '../action/actionTypes';

class BaseAnt extends LiveEntity {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, antType, pickedItemId, locatedInNestId, homeNestId, stats, behavior, 
            genome, birthStep, currentActivity) {
        super(eventBus, id, position, angle, EntityTypes.ANT, fromColony, ownerId, hp, maxHp, isInHibernation);
        this._name = name;
        this._pickedItemId = pickedItemId;
        this._antType = antType;
        this._setState('standing');
        this.locatedInNestId = locatedInNestId;
        this._homeNestId = homeNestId;
        this._stats = stats;
        this._behavior = behavior;
        this._genome = genome
        this._birthStep = birthStep;
        this._currentActivity = currentActivity;
    }

    get isVisible() {
        return super.isVisible && !this.isInNest;
    }

    get name() {
        return this._name;
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
        this.emit('locatedInNestChanged');
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

    set homeNestId(homeNestId) {
        this._homeNestId = homeNestId;
    }

    get stats() {
        return this._stats;
    }

    get guardianBehavior() {
        return this._behavior.guardianBehavior;
    }

    set guardianBehavior(behaviorValue) {
        return this._behavior.guardianBehavior = behaviorValue;
    }

    get isCooperativeBehavior() {
        return this._behavior.isCooperative;
    }

    set isCooperativeBehavior(isCooperative) {
        return this._behavior.isCooperative = isCooperative;
    }

    get genome() {
        return this._genome;
    }

    get birthStep() {
        return this._birthStep;
    }

    get isQueenOfColony() {
        return false;
    }

    get canFlyNuptialFlight() {
        return false;
    }

    set isInNuptialFlight(isInNuptialFlight) {
        this._isInNuptialFlight = isInNuptialFlight;
        this.emit('isInNuptialFlightChanged');
    }

    get isInNuptialFlight() {
        return this._isInNuptialFlight;
    }

    get canBeCooperative() {
        return true;
    }

    get canBeGuardian() {
        return true;
    }

    get currentActivity() {
        return this._currentActivity;
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
            case ACTION_TYPES.ANT_HOME_NEST_CHANGED:
                return this._playHomeNestChanged(action);
            case ACTION_TYPES.ENTITY_GOT_IN_NEST:
                return this._playGotInNest(action);
            case ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST:
                return this._playGotOutOfNest(action);
            case ACTION_TYPES.ANT_CURRENT_ACTIVITY_CHANGED:
                return this._playCurrentActivityChanged(action);
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

    _playHomeNestChanged(action) {
        this._homeNestId = action.nestId;
        this.emit('homeNestChanged');
        return Promise.resolve();
    }

    _playCurrentActivityChanged(action) {
        this._currentActivity = action.activity;
        this.emit('currentActivityChanged');
        return Promise.resolve();
    }

}

export { BaseAnt }