import { EventEmitter } from "@utils/eventEmitter";

class ServerConnection {

    constructor(socketURL) {
        this.events = new EventEmitter();
        this._socketURL = socketURL;
    }

    connect() {
        return new Promise((res) => {
            this._socket = new WebSocket(this._socketURL);
            this._socket.onmessage = this._emitMessage.bind(this);
            this._socket.onopen = () => {
                res();
            }
        });
    }

    disconnect() {
        this._socket.close();
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    _emitMessage(event) {
        this.events.emit('message', JSON.parse(event.data));
    }
}

export {
    ServerConnection
}