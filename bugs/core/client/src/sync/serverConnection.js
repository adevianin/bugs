import { EventEmitter } from "utils/eventEmitter";

class ServerConnection {

    constructor() {
        this.events = new EventEmitter();
    }

    connect() {
        return new Promise((res) => {
            this._socket = new WebSocket(`ws://${location.host}/mainsocket`);
            this._socket.onmessage = this._emitMessage.bind(this);
            this._socket.onopen = () => {
                res();
            }
        });
    }

    _emitMessage(event) {
        this.events.emit('message', JSON.parse(event.data));
    }
}

export {
    ServerConnection
}