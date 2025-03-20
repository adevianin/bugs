import { createNanoEvents } from "nanoevents";

class EventEmitter {
    constructor() {
        this._emitter = createNanoEvents();
    }

    on(eventName, callback) {
        return this._emitter.on(eventName, callback);
    }

    emit(eventName, ...args) {
        this._emitter.emit(eventName, ...args);
    }

    removeAllListeners() {
        this._emitter.events = {};
    }

}

export { EventEmitter };