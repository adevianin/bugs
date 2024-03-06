import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';
import { Egg } from './egg';

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

    addNewEgg(name, isFertilized) {
        this._nestApi.addNewEgg(this.id, name, isFertilized);
    }

    editCasteForEgg(eggId, antType) {
        this._nestApi.changeEggCaste(this.id, eggId, antType);
        let egg = this._findEggById(eggId);
        egg.antType = antType;
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
            case ACTION_TYPES.NEST_LARVA_ADDED:
                return this._playLarvaAdded(action);
            case ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                return this._playBuildStatusChanged(action);
            case ACTION_TYPES.NEST_EGG_DEVELOP:
                return this._playEggDevelop(action);
            case ACTION_TYPES.NEST_EGG_BECAME_LARVA:
                return this._playEggBecameLarva(action);
            case ACTION_TYPES.NEST_EGG_ADDED:
                return this._playEggAdded(action);
        }
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
    
    _playLarvaAdded(action) {
        let larva = Larva.buildFromJson(action.larva);
        this.larvae.push(larva);
        this.emit('larvaAdded', larva);
        return Promise.resolve();
    }

    _playEggDevelop(action) {
        let egg = this._findEggById(action.eggId);
        egg.progress = action.progress;
        return Promise.resolve();
    }

    _playEggBecameLarva(action) {
        let egg = this._findEggById(action.eggId);
        let index = this.eggs.indexOf(egg);
        this.eggs.splice(index, 1);
        this.emit('eggBecameLarva', egg);
        return Promise.resolve();
    }

    _playEggAdded(action) {
        let egg = Egg.buildFromJson(action.egg);
        this.eggs.push(egg);
        this.emit('eggAdded', egg);
        return Promise.resolve();
    }

    _playBuildStatusChanged(action) {
        this._setIsBuilt(action.actionData.is_built)
        return Promise.resolve();
    }

    _setIsBuilt(isBuilt) {
        this._setState(isBuilt ? 'built' : 'building');
    }

    _findEggById(id) {
        return this.eggs.find(egg => egg.id == id);
    }

}

export {
    Nest
}
