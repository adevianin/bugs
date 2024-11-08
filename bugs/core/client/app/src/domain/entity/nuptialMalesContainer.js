import { EventEmitter } from "@utils/eventEmitter";

class NuptialMalesContainer extends EventEmitter {

    constructor() {
        super();
        this._nuptialMales = [];
    }

    get males() {
        return this._nuptialMales;
    }

    setMales(males) {
        this._nuptialMales = males;
    }

}

export {
    NuptialMalesContainer
}