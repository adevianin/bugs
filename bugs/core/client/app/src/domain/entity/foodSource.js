import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class FoodSource extends Entity {
    constructor(eventBus, id, position, hp, maxHp, foodType, isFertile) {
        super(eventBus, id, position, EntityTypes.FOOD_SOURCE, null, hp, maxHp);
        this.foodType = foodType;
        this._isFertile = isFertile;
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
            case ACTION_TYPES.FOOD_SOURCE_FERTILITY_CHANGED:
                return this._playFertilityChangedAction(action);
        }

        return null;
    }

    _playFertilityChangedAction(action) {
        return new Promise((res) => {
            this.isFertile = action.actionData.is_fertile
            res();
        });
    }
}

export {
    FoodSource
}