class MessageHandlerService {

    constructor(serverConnection, worldService, actionService) {
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._actionService = actionService;
        this._serverConnection.events.on('message', this._onMessage.bind(this));
    }

    connect() {
        return this._serverConnection.connect();
    }

    disconnect() {
        this._serverConnection.disconnect();
    }

    _onMessage(msg) {
        console.log(msg)
        switch(msg.type) {
            case 'sync_step':
                this._worldService.initWorld(msg.world);
                break;
            case 'action':
                this._actionService.playAction(msg.action);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

}

export {
    MessageHandlerService
}