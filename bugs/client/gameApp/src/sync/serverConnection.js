import { EventEmitter } from "@common/utils/eventEmitter";

class ServerConnection {

    constructor() {
        this.events = new EventEmitter();
        this._socket = null;
    }

    connect(socketURL) {
        return new Promise((res) => {
            this._socket = new WebSocket(socketURL);
            this._socket.onmessage = this._emitMessage.bind(this);
            this._socket.onopen = () => {
                res();
            }
            this._socket.onclose = (event) => {
                if (event.code == 4001) {
                    setTimeout(() => {
                        this.events.emit('connectionClosedFromServer');
                    }, 10000);
                }
            };
        });
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    isConnected() {
        return this._socket.readyState == WebSocket.OPEN;
    }

    _emitMessage(event) {
        this.events.emit('message', JSON.parse(event.data));
    }
}

export {
    ServerConnection
}