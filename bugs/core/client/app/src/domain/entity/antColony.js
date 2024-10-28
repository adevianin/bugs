import { EventEmitter } from "@utils/eventEmitter";

class AntColony extends EventEmitter {

    constructor(eventBus, id, onwerId, operations, queenId) {
        super();
        this._eventBus = eventBus;
        this._id = id;
        this._onwerId = onwerId;
        this._operations = operations;
        this._queenId = queenId
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._onwerId;
    }

    get operations() {
        return this._operations;
    }

    get queenId() {
        return this._queenId;
    }

    playAction(action) {
        switch(action.type) {
            case 'colony_died':
                this._playColonyDiedAction(action);
                break;
            case 'colony_operations_change':
                this._playOperationsChangedAction(action);
                break;
        }
    }

    _playOperationsChangedAction(action) {
        this._operations = action.actionData.operations;
        this.emit('operationsChanged');
    }

    _playColonyDiedAction(action) {
        this._emitToEventBus('colonyDied'); //to delete colony from world
        // this.emit('died');//to delete view
    }

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

}

export {
    AntColony
}