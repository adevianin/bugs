import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { Larva } from './larva';
import { Egg } from './egg';

class Nest extends Entity {

    constructor(eventBus, id, position, angle, fromColony, ownerId, storedCalories, larvae, eggs, buildStatus, hp, maxHp, fortification, maxFortification, name, isMain, area) {
        super(eventBus, id, position, angle, EntityTypes.NEST, fromColony, ownerId, hp, maxHp);
        this._storedCalories = storedCalories;
        this._larvae = larvae;
        this._eggs = eggs;
        this._fortification = fortification;
        this._maxFortification = maxFortification;
        this._name = name;
        this._isMain = isMain;
        this._area = area;
        this._buildStatus = buildStatus;
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

    get buildStatus() {
        return this._buildStatus;
    }

    changeCasteForEgg(eggId, antType) {
        let egg = this._findEggById(eggId);
        egg.antType = antType;
        this.events.emit('eggUpdated', egg.id, {
            antType: egg.antType,
        });
    }

    changeNameForEgg(eggId, name) {
        let egg = this._findEggById(eggId);
        egg.name = name;
        this.events.emit('eggUpdated', egg.id, {
            name: egg.name,
        });
    }

    _removeEggFromArray(eggId) {
        let index = this._eggs.findIndex(e => e.id == eggId);
        if (index != -1) {
            this._eggs.splice(index, 1);
        }
    }

    _removeLarvaFromArray(larvaId) {
        let index = this._larvae.findIndex(l => l.id == larvaId);
        if (index != -1) {
            this._larvae.splice(index, 1);
        }
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
            case ACTION_TYPES.NEST_LARVA_ADDED:
                this._playLarvaAdded(action);
                return true;
            case ACTION_TYPES.NEST_LARVA_REMOVED:
                this._playLarvaRemoved(action);
                return true;
            case ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                this._playBuildStatusChanged(action);
                return true;
            case ACTION_TYPES.NEST_EGG_ADDED:
                this._playEggAdded(action);
                return true;
            case ACTION_TYPES.NEST_EGG_DEVELOP:
                this._playEggDevelop(action);
                return true;
            case ACTION_TYPES.NEST_EGG_REMOVED:
                this._playEggRemoved(action);
                return true;
            case ACTION_TYPES.NEST_FORTIFICATION_CHANGED:
                this._playFortificationChanged(action);
                return true;
            case ACTION_TYPES.NEST_RENAMED:
                this._playRenamed(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playStoredCaloriesChanged(action) {
        this._storedCalories = action.storedCalories;
        this.events.emit('storedCaloriesChanged');
    }

    _playLarvaFed(action) {
        let larva = this._larvae.find(larva => larva.id == action.larvaId);
        larva.ateFood = action.ateFood;
        this.events.emit('larvaUpdated', larva.id, {
            ateFood: larva.ateFood
        });
    }

    _playLarvaAdded(action) {
        let larva = Larva.buildFromJson(action.larva);
        this._larvae.push(larva);
        this.events.emit('larvaAdded', larva);
    }

    _playLarvaRemoved(action) {
        this._removeLarvaFromArray(action.larvaId);
        this.events.emit('larvaRemoved', action.larvaId);
    }
    
    _playEggDevelop(action) {
        let egg = this._findEggById(action.eggId);
        egg.updateProgress(action.progress, action.state);
        this.events.emit('eggUpdated', egg.id, {
            state: egg.state,
            progress: egg.progress
        });
    }

    _playEggAdded(action) {
        let egg = Egg.buildFromJson(action.egg); 
        this._eggs.push(egg);
        this.events.emit('eggAdded', egg);
    }

    _playEggRemoved(action) {
        this._removeEggFromArray(action.eggId);
        this.events.emit('eggRemoved', action.eggId);
    }

    _playBuildStatusChanged(action) {
        this._buildStatus = action.buildStatus;
        this._requestActionAnimation(ACTION_TYPES.NEST_BUILD_STATUS_CHANGED, {
            buildStatus: this._buildStatus
        });
    }

    _playFortificationChanged(action) {
        this.fortification = action.fortification;
        this._requestActionAnimation(ACTION_TYPES.NEST_FORTIFICATION_CHANGED, {
            fortification: this.fortification
        });
    }

    _playRenamed(action) {
        this._name = action.name;
        this._requestActionAnimation(ACTION_TYPES.NEST_RENAMED, {
            name: action.name
        });
        this.events.emit('nameChanged');
    }

    _requestEntityDiedAnimation() {
        this._requestActionAnimation(ACTION_TYPES.ENTITY_DIED, {
            buildStatus: this.buildStatus
        });
    }

}

export {
    Nest
}
