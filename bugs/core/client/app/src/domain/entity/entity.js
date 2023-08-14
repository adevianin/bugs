import { EventEmitter } from "utils/eventEmitter";
import { ACTION_TYPES } from './action/actionTypes';

class Entity extends EventEmitter {

    constructor(eventBus, id, position, type, fromColony, hp, maxHp) {
        super();
        this._eventBus = eventBus;
        this.id = id;
        this._position = position;
        this.type = type;
        this._fromColony = fromColony;
        this._actionStack = [];
        this._isPlaying = false;
        this._isHidden = false;
        this._angle = 0;
        this._hp = hp;
        this._maxHp = maxHp;
    }

    get state() {
        return this._state;
    }

    setPosition(x, y) {
        this._position = {x, y};
        this.emit('positionChanged');
    }

    get position(){
        return this._position;
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
        this.emit('angleChanged');
    }

    get fromColony() {
        return this._fromColony;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
        this.emit('hpChanged');
    }

    get maxHp() {
        return this._maxHp
    }

    addAction(action) {
        this._actionStack.push(action);
        this.tryPlayNextAction();
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.ENTITY_HP_CHANGE:
                return this._playHpChange(action);
            case ACTION_TYPES.ENTITY_DIED:
                return this._playEntityDied(action);
        }

        return null;
    }

    tryPlayNextAction() {
        if (this._actionStack.length == 0 || this._isPlaying) {
            return
        }
        let nextAction = this._actionStack[0];
        this._actionStack.shift();
        this._isPlaying = true;
        this.playAction(nextAction)
            .then(() => {
                this._isPlaying = false;
                this.tryPlayNextAction();
            });
    }

    globalEmit(eventName, data) {
        this._eventBus.emit(eventName, data);
    }

    die() {
        this.globalEmit('died', this);//to delete entity from world
        this.emit('died');//to delete view
    }

    _setState(newState) {
        let isStateDifferent = this._state != newState;
        this._state = newState;
        if (isStateDifferent) {
            this.emit('stateChanged');
        }
    }

    _playHpChange(action) {
        this.hp = action.actionData.hp;
        return Promise.resolve();
    }

    _playEntityDied(action) {
        this._setState('dead');
        return new Promise((res) => {
            setTimeout(() => {
                this.die();
                res();
            }, 5000)
        });
    }

}

export {
    Entity
}