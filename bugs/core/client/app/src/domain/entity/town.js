import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Town extends Entity {

    constructor(eventBus, id, position, ownerId, storedCalories, larvae, larvaPlacesCount) {
        super(eventBus, id, position, EntityTypes.TOWN);
        this.ownerId = ownerId;
        this.storedCalories = storedCalories;
        this.larvae = larvae;
        this.larvaPlacesCount = larvaPlacesCount;
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.TOWN_WAS_GIVEN_FOOD:
                return this._playTakingFood(action);
            default:
                throw 'unknown type of action'
        }
    }

    canAddLarva() {
        return this.larvaPlacesCount > this.larvae.length;
    }

    _playTakingFood(action) {
        this.storedCalories = action.additionalData.stored_calories;
        this.emit('storedCaloriesChanged');
        return Promise.resolve();
    }

}

export {
    Town
}
