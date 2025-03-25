import { Entity } from "./entity"
import { EntityTypes } from "../enum/entityTypes";
import { ACTION_TYPES } from "./action/actionTypes";

class ItemSource extends Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, isFertile) {
        super(eventBus, id, position, angle, EntityTypes.ITEM_SOURCE, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._isFertile = isFertile;
    }

    get itemType() {
        return this._itemType;
    }

    set isFertile(value) {
        this._isFertile = value;
    }

    get isFertile() {
        return this._isFertile;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }
        switch (action.type) {
            case ACTION_TYPES.ITEM_SOURCE_FERTILITY_CHANGED:
                this._playFertilityChangedAction(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playFertilityChangedAction(action) {
        this.isFertile = action.isFertile;
        this._requestActionAnimation(ACTION_TYPES.ITEM_SOURCE_FERTILITY_CHANGED, {
            isFertile: this.isFertile
        })
    }
}

export {
    ItemSource
}