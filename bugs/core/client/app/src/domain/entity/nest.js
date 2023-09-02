import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';

class Nest extends Entity {

    constructor(eventBus, nestApi, id, position, angle, fromColony, storedCalories, larvae, larvaPlacesCount, isBuilt, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.NEST, fromColony, hp, maxHp);
        this._nestApi = nestApi;
        this.storedCalories = storedCalories;
        this.larvae = larvae;
        this.larvaPlacesCount = larvaPlacesCount;

        this._setIsBuilt(isBuilt)
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.NEST_STORED_CALORIES_CHANGED:
                return this._playTakingFood(action);
            case ACTION_TYPES.NEST_LARVAE_CHANGED:
                return this._playLarvaeChanged(action);
            case ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                return this._playBuildStatusChanged(action);
            case ACTION_TYPES.ENTITY_DIED:
                return this._playNestDestroyed(action);
        }
    }

    canAddLarva() {
        return this.larvaPlacesCount > this.larvae.length;
    }

    addNewLarva(antType) {
        this._nestApi.addNewLarva(this.id, antType);
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

    _playBuildStatusChanged(action) {
        this._setIsBuilt(action.actionData.is_built)
        return Promise.resolve();
    }

    _playNestDestroyed(action) {
        this._setState('destroyed');
        return new Promise((res) => {
            setTimeout(() => {
                this.die();
                res();
            }, 5000)
        });
    }

    _setIsBuilt(isBuilt) {
        this._setState(isBuilt ? 'built' : 'building');
    }

}

export {
    Nest
}
