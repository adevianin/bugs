import { EventEmitter } from "@utils/eventEmitter";

class FoundMalesCollection extends EventEmitter {

    constructor(eventBus) {
        super();
        this._eventBus = eventBus;
        this._males = [];
    }

    setMales(males) {
        this._males = males;
    }
}

export {
    FoundMalesCollection
}