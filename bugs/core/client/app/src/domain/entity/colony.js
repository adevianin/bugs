import { EventEmitter } from "@utils/eventEmitter";

class Colony extends EventEmitter {

    constructor(id, onwerId, operations) {
        super();
        this._id = id;
        this._onwerId = onwerId;
        this._operations = operations;
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

    setOperations(operations) {
        this._operations = operations;
        this.emit('operationsChanged');
    }

}

export {
    Colony
}