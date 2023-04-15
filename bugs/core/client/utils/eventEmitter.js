import EventEmitterLib from "events";

class EventEmitter extends EventEmitterLib {

    on(eventName, callback) {
        super.on(eventName, callback);

        return () => {
            this.off(eventName, callback);
        }
    }

}

export { EventEmitter }