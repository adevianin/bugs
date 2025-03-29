import { Entity } from "./entity"
import { EntityTypes } from "../enum/entityTypes";
import { ACTION_TYPES } from "./action/actionTypes";

class ItemSource extends Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, isDamaged, accumulated, maxAccumulated, fertility) {
        super(eventBus, id, position, angle, EntityTypes.ITEM_SOURCE, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._isDamaged = isDamaged;
        this._accumulated = accumulated;
        this._maxAccumulated = maxAccumulated;
        this._fertility = fertility;
    }

    get itemType() {
        return this._itemType;
    }

    get isDamaged() {
        return this._isDamaged;
    }

    get accumulated() {
        return this._accumulated;
    }

    get maxAccumulated() {
        return this._maxAccumulated;
    }

    get fertility() {
        return this._fertility;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }
        switch (action.type) {
            case ACTION_TYPES.ITEM_SOURCE_IS_DAMAGED_CHANGED:
                this._playIsDamagedChangedAction(action);
                return true;
            case ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED:
                this._playAccumulatedChangedAction(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playIsDamagedChangedAction(action) {
        this._isDamaged = action.isDamaged;
        this._requestActionAnimation(ACTION_TYPES.ITEM_SOURCE_IS_DAMAGED_CHANGED, {
            isDamaged: this._isDamaged
        })
    }

    _playAccumulatedChangedAction(action) {
        this._accumulated = action.accumulated;
        this._requestActionAnimation(ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED, {
            accumulated: this._accumulated
        })
    }
}

export {
    ItemSource
}