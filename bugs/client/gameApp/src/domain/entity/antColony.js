import { ACTION_TYPES } from "./action/actionTypes";
import { EventEmitter } from "@common/utils/eventEmitter";

class AntColony extends EventEmitter {

    constructor(eventBus, id, onwerId, name, operations) {
        super();
        this._eventBus = eventBus;
        this._id = id;
        this._onwerId = onwerId;
        this._operations = operations;
        this._name = name;
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
            default:
                throw 'unknown colony action type';
        }
    }

    _playColonyOperationCreated(action) {
        this._operations.push(action.operation);
        this.emit('addedOperation', action.operation);
    }

    _playColonyOperationChanged(action) {
        let operation = this._findOperationById(action.operation.id);
        Object.assign(operation, action.operation);
        this.emit('operationChanged', operation);
    }

    _playColonyOperationDeleted(action) {
        let deletedOperationId = action.operationId;
        this._operations = this._operations.filter(operation => operation.id != deletedOperationId);
        this.emit('operationDeleted', deletedOperationId);
    }

    // _playOperationsChangedAction(action) {
    //     this._operations = action.actionData.operations;
    //     this.emit('operationsChanged');
    // }

    _playColonyDiedAction(action) {
        this._emitToEventBus('colonyDied'); //to delete colony from world
        // this.emit('died');//to delete view
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