import { LiveEntity } from '../liveEntity';
import { EntityTypes } from '@domain/enum/entityTypes';
import { ACTION_TYPES } from '../action/actionTypes';

class BaseAnt extends LiveEntity {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, antType, pickedItemId, locatedInNestId, homeNestId, stats, behavior, 
            genome, birthStep, currentActivity, isHungry) {
        super(eventBus, id, position, angle, EntityTypes.ANT, fromColony, ownerId, hp, maxHp, isInHibernation);
        this._name = name;
        this._pickedItemId = pickedItemId;
        this._antType = antType;
        this.locatedInNestId = locatedInNestId;
        this._homeNestId = homeNestId;
        this._stats = stats;
        this._behavior = behavior;
        this._genome = genome
        this._birthStep = birthStep;
        this._currentActivity = currentActivity;
        this._isHungry = isHungry;
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
        this.events.emit('homeNestChanged');
    }

    get stats() {
        return this._stats;
    }

    get guardianBehavior() {
        return this._behavior.guardianBehavior;
    }

    set guardianBehavior(behaviorValue) {
        this._behavior.guardianBehavior = behaviorValue;
        this.events.emit('guardianBehaviorChanged');
    }

    get isCooperativeBehavior() {
        return this._behavior.isCooperative;
    }

    set isCooperativeBehavior(isCooperative) {
        this._behavior.isCooperative = isCooperative;
        this.events.emit('isCooperativeBehaviorChanged');
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

    set isInNuptialFlight(val) {
        this._isInNuptialFlight = val;
        this.events.emit('isInNuptialFlightChanged');
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

    set currentActivity(val) {
        this._currentActivity = val;
        this.events.emit('currentActivityChanged');
    }

    get isHungry() {
        return this._isHungry;
    }

    set isHungry(val) {
        this._isHungry = val;
        this.events.emit('isHungryChanged');
    }

    hasPickedItem() {
        return !!this._pickedItemId;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case ACTION_TYPES.ANT_PICKED_UP_ITEM:
                this._playItemPickingAction(action);
                return true;
            case ACTION_TYPES.ANT_DROPPED_PICKED_ITEM:
                this._playItemDroped(action);
                return true;
            case ACTION_TYPES.ANT_HOME_NEST_CHANGED:
                this._playHomeNestChanged(action);
                return true;
            case ACTION_TYPES.ENTITY_GOT_IN_NEST:
                this._playGotInNest(action);
                return true;
            case ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST:
                this._playGotOutOfNest(action);
                return true;
            case ACTION_TYPES.ANT_CURRENT_ACTIVITY_CHANGED:
                this._playCurrentActivityChanged(action);
                return true;
            case ACTION_TYPES.ANT_HUNGRY_STATE_CHANGED:
                this._playHungryStateChanged(action);
                return true;
            default:
                return false;
        }
    }

    _playItemPickingAction(action) {
        this.pickedItemId = action.actionData.item_id;
        this._requestActionAnimation(ACTION_TYPES.ANT_PICKED_UP_ITEM, {
            itemId: this.pickedItemId
        });
    }

    _playItemDroped(action) {
        this._requestActionAnimation(ACTION_TYPES.ANT_DROPPED_PICKED_ITEM, {
            droppingItemId: this.pickedItemId
        });
        this.pickedItemId = null;
    }

    _playGotInNest(action) {
        this.locatedInNestId = action.actionData.nest_id;
        this._requestActionAnimation(ACTION_TYPES.ENTITY_GOT_IN_NEST, {
            isAntVisibleAfter: this.isVisible
        });
    }

    _playGotOutOfNest() {
        this.locatedInNestId = null;
        this._requestActionAnimation(ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST, {
            isAntVisibleAfter: this.isVisible
        });
    }

    _playHomeNestChanged(action) {
        this.homeNestId = action.nestId;
    }

    _playCurrentActivityChanged(action) {
        this.currentActivity = action.activity;
    }

    _playHungryStateChanged(action) {
        this.isHungry = action.isHungry;
    }

}

export { BaseAnt }