import { ACTION_TYPES } from "./action/actionTypes";
import { EventEmitter } from "@common/utils/eventEmitter";

class AntColony {

    constructor(eventBus, id, onwerId, name, operations, enemies) {
        this.events = new EventEmitter();
        this._eventBus = eventBus;
        this._id = id;
        this._onwerId = onwerId;
        this._operations = operations;
        this._name = name;
        this._enemies = enemies;
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._onwerId;
    }

    get name() {
        return this._name;
    }

    get operations() {
        return this._operations;
    }

    get enemies() {
        return this._enemies;
    }

    playAction(action) {
        switch(action.type) {
            case ACTION_TYPES.COLONY_DIED:
                this._playColonyDiedAction(action);
                break;
            case ACTION_TYPES.COLONY_OPERATION_CREATED:
                this._playColonyOperationCreated(action)
                break;
            case ACTION_TYPES.COLONY_OPERATION_CHANGED:
                this._playColonyOperationChanged(action)
                break;
            case ACTION_TYPES.COLONY_OPERATION_DELETED:
                this._playColonyOperationDeleted(action)
                break;
            case ACTION_TYPES.COLONY_ENEMIES_CHANGED:
                this._playColonyEnemiesChanged(action)
                break;
            default:
                throw 'unknown colony action type';
        }
    }

    _playColonyOperationCreated(action) {
        this._operations.push(action.operation);
        this.events.emit('addedOperation', action.operation);
        // this.events.emit(`addedOperation:${action.operation.id}`);
    }

    _playColonyOperationChanged(action) {
        let operation = this._findOperationById(action.operation.id);
        Object.assign(operation, action.operation);
        this.events.emit('operationChanged', operation);
    }

    _playColonyOperationDeleted(action) {
        let deletedOperationId = action.operationId;
        this._operations = this._operations.filter(operation => operation.id != deletedOperationId);
        this.events.emit('operationDeleted', deletedOperationId);
    }

    _playColonyEnemiesChanged(action) {
        this._enemies = action.enemies;
        this.events.emit('enemiesChanged');
    }

    _playColonyDiedAction(action) {
        this._emitToEventBus('colonyDied'); //to delete colony from world
        this.events.removeAllListeners();
    }

    _findOperationById(id) {
        for (let operation of this._operations) {
            if (operation.id == id) {
                return operation;
            }
        }

        return null;
    }

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

}

export {
    AntColony
}