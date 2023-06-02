import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';

class Town extends Entity {

    constructor(eventBus, townApi, id, position, ownerId, storedCalories, larvae, larvaPlacesCount) {
        super(eventBus, id, position, EntityTypes.TOWN, ownerId);
        this._townApi = townApi;
        this.storedCalories = storedCalories;
        this.larvae = larvae;
        this.larvaPlacesCount = larvaPlacesCount;
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.TOWN_STORED_CALORIES_CHANGED:
                return this._playTakingFood(action);
            case ACTION_TYPES.TOWN_LARVAE_CHANGED:
                return this._playLarvaeChanged(action);
            default:
                throw 'unknown type of action'
        }
    }

    canAddLarva() {
        return this.larvaPlacesCount > this.larvae.length;
    }

    addNewLarva(antType) {
        this._townApi.addNewLarva(this.id, antType);
    }

    _playTakingFood(action) {
        this.storedCalories = action.actionData.stored_calories;
        this.emit('storedCaloriesChanged');
        return Promise.resolve();
    }

    _playLarvaeChanged(action) {
        this.larvae = [];
        action.actionData.larvae.forEach(larvaJson => {
            this.larvae.push(Larva.fromJson(larvaJson.ant_type, larvaJson.progress));
        });
        this.emit('larvaeChanged');
        return Promise.resolve();
    }

}

export {
    Town
}
