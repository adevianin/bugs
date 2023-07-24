import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Food extends Entity {
    constructor(eventBus, id, position, calories, food_type, food_varity, is_picked) {
        super(eventBus, id, position, EntityTypes.FOOD, null);
        this.calories = calories;
        this._food_type = food_type;
        this._food_variety = food_varity;
        this._is_picked = is_picked;
    }

    get food_type() {
        return this._food_type;
    }

    get food_variety() {
        return this._food_variety;
    }

    get is_picked() {
        return this._is_picked;
    }

    set is_picked(value) {
        this._is_picked = value;
        this.emit('isPickedChanged');
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.FOOD_WAS_PICKED_UP:
                return this._playFoodPickedUp(action);
            case ACTION_TYPES.FOOD_WAS_DROPPED:
                return this._playFoodDrop(action);
            case ACTION_TYPES.ENTITY_DIED:
                return this._playEntityDied(action);
            default:
                throw 'unknown type of action'
        }
    }

    _playFoodPickedUp(action) {
        return new Promise((res) => {
            this.is_picked = true;
            res();
        });
    }
    
    _playFoodDrop(action) {
        return new Promise((res) => {
            this.is_picked = false;
            let pos = action.actionData.position;
            this.setPosition(pos.x, pos.y);
            res();
        });
    }

    _playEntityDied(action) {
        return new Promise((res) => {
            this.die();
            res();
        });
    }
}

export {
    Food
}