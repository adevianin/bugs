import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';

class Nest extends Entity {

    constructor(eventBus, nestApi, id, position, angle, fromColony, ownerId, storedCalories, larvae, eggs, larvaPlacesCount, eggPlacesCount, isBuilt, hp, maxHp) {
        super(eventBus, id, position, angle, EntityTypes.NEST, fromColony, ownerId, hp, maxHp);
        this._nestApi = nestApi;
        this.storedCalories = storedCalories;
        this.larvae = larvae;
        this.eggs = eggs;
        this.larvaPlacesCount = larvaPlacesCount;
        this.eggPlacesCount = eggPlacesCount;

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
            case ACTION_TYPES.NEST_LARVA_FED:
                return this._playLarvaFed(action);
            case ACTION_TYPES.NEST_LARVA_IS_READY:
                return this._playLarvaIsReady(action);
            case ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                return this._playBuildStatusChanged(action);
            case ACTION_TYPES.NEST_EGG_DEVELOP:
                return this._playEggDevelop(action);
            case ACTION_TYPES.NEST_EGG_BECAME_LARVA:
                return this._playEggBecameLarva(action);
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

    _playLarvaFed(action) {
        let larva = this.larvae.find(larva => larva.id == action.larvaId);
        larva.progress = action.progress;
        return Promise.resolve();
    }

    _playLarvaIsReady(action) {
        let larva = this.larvae.find(larva => larva.id == action.larvaId);
        let index = this.larvae.indexOf(larva);
        this.larvae.splice(index, 1);
        this.emit('larvaIsReady', larva);
        return Promise.resolve();
    }

    _playEggDevelop(action) {
        let egg = this.eggs.find(egg => egg.id == action.eggId);
        egg.progress = action.progress;
        return Promise.resolve();
    }

    _playEggBecameLarva(action) {
        let egg = this.eggs.find(egg => egg.id == action.eggId);
        let index = this.eggs.indexOf(egg);
        this.eggs.splice(index, 1);
        this.emit('eggBecameLarva', egg);
        return Promise.resolve();
    }

    _playBuildStatusChanged(action) {
        this._setIsBuilt(action.actionData.is_built)
        return Promise.resolve();
    }

    _setIsBuilt(isBuilt) {
        this._setState(isBuilt ? 'built' : 'building');
    }

}

export {
    Nest
}
