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
        this.emit('fertileChanged');
    }

    get isFertile() {
        return this._isFertile;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ITEM_SOURCE_FERTILITY_CHANGED:
                return this._playFertilityChangedAction(action);
        }

        return null;
    }

    _playFertilityChangedAction(action) {
        return new Promise((res) => {
            this.isFertile = action.isFertile
            res();
        });
    }
}

export {
    ItemSource
}