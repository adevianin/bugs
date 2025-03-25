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

    setPosition(x, y) {
        this._position = {x, y};
        this.emit('positionChanged');
        this._eventBus.emit('entityMoved', this);
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
        this.emit('chunkIdChanged', chunkId);
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.ENTITY_HP_CHANGE:
                this._playHpChange(action);
                return true;
            case ACTION_TYPES.ENTITY_DIED:
                this._playEntityDied(action);
                return true;
            case ACTION_TYPES.ENTITY_COLONY_CHANGED:
                this._playEntityColonyChanged(action);
                return true;
            default:
                return false;
        }
    }

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

    _playHpChange(action) {
        this.hp = action.actionData.hp;
        this._requestActionAnimation(ACTION_TYPES.ENTITY_HP_CHANGE, {
            hp: this.hp
        });
    }

    _playEntityDied(action) {
        this._isDied = true;
        this._emitToEventBus('entityDied');//to delete entity from world
        this.emit('died');//to delete from ants table view
        this._requestActionAnimation(ACTION_TYPES.ENTITY_DIED)
    }

    _playEntityColonyChanged(action) {
        this._fromColony = action.colonyId;
    }

    _requestActionAnimation(actionType, animationParams = {}) {
        this.emit(`actionAnimationReqest:${actionType}`, animationParams);
    }

}

export {
    Entity
}