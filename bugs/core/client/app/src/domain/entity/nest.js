import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';
import { Egg } from './egg';
import { CONSTS } from '@domain/consts';

class Nest extends Entity {

    constructor(eventBus, nestApi, id, position, angle, fromColony, ownerId, storedCalories, larvae, eggs, isBuilt, hp, maxHp, fortification, maxFortification, name, isMain) {
        super(eventBus, id, position, angle, EntityTypes.NEST, fromColony, ownerId, hp, maxHp);
        this._nestApi = nestApi;
        this.storedCalories = storedCalories;
        this.larvae = larvae;
        this.eggs = eggs;
        this._fortification = fortification;
        this.maxFortification = maxFortification;
        this._name = name;
        this.isMain = isMain;

        this._setIsBuilt(isBuilt)
    }

    get name() {
        return this._name;
    }

    get takenChildPlacesCount() {
        return this.larvae.length + this.eggs.length;
    }

    get fortification() {
        return this._fortification;
    }

    set fortification(value) {
        this._fortification = value;
        this.emit('fortificationChanged');
    }


    rename(newName) {
        this._name = newName;
        this._nestApi.renameNest(this.id, newName);
        this.emit('nameChanged');
    }
    
    addNewEgg(name, isFertilized) {
        return this._nestApi.addNewEgg(this.id, name, isFertilized);
    }

    eggToLarvaChamber(eggId) {
        this._nestApi.eggToLarvaChamber(this.id, eggId);
    }

    eggDelete(eggId) {
        this._nestApi.eggDelete(this.id, eggId);

        let egg = this._findEggById(eggId);
        this._removeEggFromArray(egg);
        this.emit('eggDeleted', egg);
    }

    editCasteForEgg(eggId, antType) {
        this._nestApi.changeEggCaste(this.id, eggId, antType);
        let egg = this._findEggById(eggId);
        egg.antType = antType;
    }

    editNameForEgg(eggId, name) {
        this._nestApi.changeEggName(this.id, eggId, name);
        let egg = this._findEggById(eggId);
        egg.name = name;
    }

    larvaDelete(larvaId) {
        this._nestApi.larvaDelete(this.id, larvaId);
        let larva = this._findLarvaById(larvaId);
        this._removeLarvaFromArray(larva);
        this.emit('larvaDeleted', larva);
    }

    _removeEggFromArray(egg) {
        let index = this.eggs.indexOf(egg);
        this.eggs.splice(index, 1);
    }

    _removeLarvaFromArray(larva) {
        let index = this.larvae.indexOf(larva);
        this.larvae.splice(index, 1);
    }

    _findEggById(id) {
        return this.eggs.find(egg => egg.id == id);
    }

    _findLarvaById(id) {
        return this.larvae.find(larva => larva.id == id);
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.NEST_STORED_CALORIES_CHANGED:
                return this._playStoredCaloriesChanged(action);
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
            case ACTION_TYPES.NEST_FORTIFICATION_CHANGED:
                return this._playFortificationChanged(action);
        }
    }

    _playStoredCaloriesChanged(action) {
        this.storedCalories = action.actionData.stored_calories;
        this.emit('storedCaloriesChanged');
        return Promise.resolve();
    }

    _playLarvaFed(action) {
        let larva = this.larvae.find(larva => larva.id == action.larvaId);
        larva.ateFood = action.ateFood;
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
        egg.updateProgress(action.progress, action.state);
        return Promise.resolve();
    }

    _playEggBecameLarva(action) {
        let egg = this._findEggById(action.eggId);
        this._removeEggFromArray(egg);
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

    _playFortificationChanged(action) {
        this.fortification = action.fortification;
        return Promise.resolve();
    }

    _setIsBuilt(isBuilt) {
        this._setState(isBuilt ? 'built' : 'building');
    }

}

export {
    Nest
}
