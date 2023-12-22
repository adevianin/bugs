import { EventEmitter } from "@utils/eventEmitter";

class AntColony extends EventEmitter {

    constructor(id, onwerId, operations, queenId) {
        super();
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

    setOperations(operations) {
        this._operations = operations;
        this.emit('operationsChanged');
    }

}

export {
    AntColony
}