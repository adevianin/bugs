import { EventEmitter } from "@common/utils/eventEmitter";
import { ACTION_TYPES } from './action/actionTypes';

class Entity extends EventEmitter {

    constructor(eventBus, id, position, angle, type, fromColony, ownerId, hp, maxHp) {
        super();
        this._eventBus = eventBus;
        this.id = id;
        this._position = position;
        this.type = type;
        this._fromColony = fromColony;
        this._ownerId = ownerId;
        this._actionStack = [];
        this._isPlaying = false;
        this._angle = angle;
        this._hp = hp;
        this._maxHp = maxHp;
        this._isDied = false;
        this._chunkId = null;
    }

    get isVisible() {
        return true;
    }

    get state() {
        return this._state;
    }

    setPosition(x, y, isMotion = false) {
        this._position = {x, y};
        this.emit('positionChanged');
        if (!isMotion) {
            this._eventBus.emit('entityMoved', this);
        }
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

    get ownerId() {
        return this._ownerId;
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

    get isDied() {
        return this._isDied;
    }

    get chunkId() {
        return this._chunkId;
    }

    set chunkId(chunkId) {
        if (this._isDied) {
            return; //to prevent changing chunkId and hiding dead state view 
        }
        this._chunkId = chunkId;
        this.emit('chunkIdChanged');
    }

    lookAt(x, y) {
        this.angle = (Math.atan2(y - this._position.y, x - this._position.x) * 180 / Math.PI) + 90;
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
            case ACTION_TYPES.ENTITY_COLONY_CHANGED:
                return this._playEntityColonyChanged(action)
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

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

    die() {
        this._isDied = true;
        this._emitToEventBus('entityDied');//to delete entity from world
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
        this.die();
        return Promise.resolve();
    }

    _playEntityColonyChanged(action) {
        this._fromColony = action.colonyId;
        return Promise.resolve();
    }

    _calcAnimationTimeMultiplier(actionType) {
        let actionsCount = 0;
        for (let action of this._actionStack) {
            if (action.type == actionType) {
                actionsCount++;
            }
        }
        switch(actionsCount) {
            case 0:
                return 1;
            case 1:
                return 0.75;
            case 2:
                return 0.5;
            case 3:
                return 0.4;
            default:
                return 0.2;
        }
    }

    _requestActionAnimation(actionType, animationParams = {}) {
        let timeMultiplier = this._calcAnimationTimeMultiplier(actionType);
        return new Promise((res, rej) => {
            this.emit(`actionAnimationReqest:${actionType}`, animationParams, timeMultiplier, res);
        });
    }

}

export {
    Entity
}