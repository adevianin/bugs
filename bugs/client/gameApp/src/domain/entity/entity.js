import { EventEmitter } from "@common/utils/eventEmitter";
import { ACTION_TYPES } from './action/actionTypes';

class Entity {

    constructor(eventBus, id, position, angle, type, fromColony, ownerId, hp, maxHp) {
        this.events = new EventEmitter();
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
        this.events.emit('positionChanged');
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
        this.events.emit('angleChanged');
    }

    get fromColony() {
        return this._fromColony;
    }

    set fromColony(val) {
        this._fromColony = val;
        this.events.emit('fromColonyChanged');
    }

    get ownerId() {
        return this._ownerId;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
        this.events.emit('hpChanged');
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

    set chunkId(newChunkId) {
        let prevChunkId = this._chunkId;
        this._chunkId = newChunkId;
        if (newChunkId && prevChunkId) {
            this._eventBus.emit('entityChunkMigration', this, prevChunkId);
        } else if (newChunkId && !prevChunkId) {
            this._eventBus.emit('entityAddedToChunks', this, null);
        } else if (!newChunkId && prevChunkId) {
            this._eventBus.emit('entityRemovedFromChunks', this);
        } 
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
        this._requestActionAnimation(ACTION_TYPES.ENTITY_DIED);
        this._emitToEventBus('entityDied');//to delete entity from world
        this.events.removeAllListeners();
    }

    _playEntityColonyChanged(action) {
        this.fromColony = action.colonyId;
    }

    _requestActionAnimation(animationType, animationParams = {}) {
        this._eventBus.emit('entityActionAnimationRequest', this._chunkId, this.id, animationType, animationParams);
    }

}

export {
    Entity
}