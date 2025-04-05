import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';
import { Egg } from './egg';

class Nest extends Entity {

    constructor(eventBus, id, position, angle, fromColony, ownerId, storedCalories, larvae, eggs, isBuilt, hp, maxHp, fortification, maxFortification, name, isMain, area) {
        super(eventBus, id, position, angle, EntityTypes.NEST, fromColony, ownerId, hp, maxHp);
        this._storedCalories = storedCalories;
        this._larvae = larvae;
        this._eggs = eggs;
        this._fortification = fortification;
        this._maxFortification = maxFortification;
        this._name = name;
        this._isMain = isMain;
        this._area = area;
        this._isBuilt = isBuilt;
    }

    get storedCalories() {
        return this._storedCalories;
    }

    get larvae() {
        return this._larvae;
    }

    get eggs() {
        return this._eggs;
    }

    get fortification() {
        return this._fortification;
    }

    set fortification(value) {
        this._fortification = value;
    }

    get maxFortification() {
        return this._maxFortification;
    }

    get name() {
        return this._name;
    }

    get isMain() {
        return this._isMain;
    }

    get area() {
        return this._area;
    }

    get isBuilt() {
        return this._isBuilt;
    }

    rename(newName) {
        this._name = newName;
        this.emit('nameChanged');
    }
    
    eggDelete(eggId) {
        let egg = this._findEggById(eggId);
        this._removeEggFromArray(egg);
        this.emit('eggDeleted', egg);
    }

    changeCasteForEgg(eggId, antType) {
        let egg = this._findEggById(eggId);
        egg.antType = antType;
    }

    changeNameForEgg(eggId, name) {
        let egg = this._findEggById(eggId);
        egg.name = name;
    }

    larvaDelete(larvaId) {
        let larva = this._findLarvaById(larvaId);
        this._removeLarvaFromArray(larva);
        this.emit('larvaDeleted', larva);
    }

    addNewEgg(egg) {
        this._eggs.push(egg);
        this.emit('eggAdded', egg);
    }

    moveEggToLarvaChamber(eggId, larva) {
        let egg = this._findEggById(eggId);
        this._removeEggFromArray(egg);
        this.emit('eggBecameLarva', egg);
        this._larvae.push(larva);
        this.emit('larvaAdded', larva);
    }

    _removeEggFromArray(egg) {
        let index = this._eggs.indexOf(egg);
        this._eggs.splice(index, 1);
    }

    _removeLarvaFromArray(larva) {
        let index = this._larvae.indexOf(larva);
        this._larvae.splice(index, 1);
    }

    _findEggById(id) {
        return this._eggs.find(egg => egg.id == id);
    }

    _findLarvaById(id) {
        return this._larvae.find(larva => larva.id == id);
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }
        switch (action.type) {
            case ACTION_TYPES.NEST_STORED_CALORIES_CHANGED:
                this._playStoredCaloriesChanged(action);
                return true;
            case ACTION_TYPES.NEST_LARVA_FED:
                this._playLarvaFed(action);
                return true;
            case ACTION_TYPES.NEST_LARVA_IS_READY:
                this._playLarvaIsReady(action);
                return true;
            case ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                this._playBuildStatusChanged(action);
                return true;
            case ACTION_TYPES.NEST_EGG_DEVELOP:
                this._playEggDevelop(action);
                return true;
            case ACTION_TYPES.NEST_FORTIFICATION_CHANGED:
                this._playFortificationChanged(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playStoredCaloriesChanged(action) {
        this._storedCalories = action.storedCalories;
        this.emit('storedCaloriesChanged');
    }

    _playLarvaFed(action) {
        let larva = this._larvae.find(larva => larva.id == action.larvaId);
        if (larva) { // for case when larva is not yet created after http request
            larva.ateFood = action.ateFood;
        }
    }

    _playLarvaIsReady(action) {
        let larva = this._larvae.find(larva => larva.id == action.larvaId);
        let index = this._larvae.indexOf(larva);
        this._larvae.splice(index, 1);
        this.emit('larvaIsReady', larva);
    }
    
    _playEggDevelop(action) {
        let egg = this._findEggById(action.eggId);
        if (egg) { // for case when egg is not yet created after http request
            egg.updateProgress(action.progress, action.state);
        }
    }

    _playBuildStatusChanged(action) {
        this._isBuilt = action.isBuilt;
        this._requestActionAnimation(ACTION_TYPES.NEST_BUILD_STATUS_CHANGED, {
            isBuilt: this._isBuilt
        });
    }

    _playFortificationChanged(action) {
        this.fortification = action.fortification;
        this._requestActionAnimation(ACTION_TYPES.NEST_FORTIFICATION_CHANGED, {
            fortification: this.fortification
        });
    }

}

export {
    Nest
}
