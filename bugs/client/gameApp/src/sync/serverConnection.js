import { EventEmitter } from "@common/utils/eventEmitter";
import { CONSTS } from "@domain/consts";

class ServerConnection {

    constructor() {
        this.events = new EventEmitter();
        this._socket = null;
        this._lastMsgTime = null;
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

    disconnect() {
        this._socket.close();
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    isConnected() {
        const MAX_TIME_BETWEEN_MSGS = CONSTS.STEP_TIME * 1000 * 2;
        return this._socket.readyState == WebSocket.OPEN && 
            performance.now() - this._lastMsgTime < MAX_TIME_BETWEEN_MSGS;
    }

    _emitMessage(event) {
        this.events.emit('message', JSON.parse(event.data));
        this._lastMsgTime = performance.now();
    }
}

export {
    ServerConnection
}