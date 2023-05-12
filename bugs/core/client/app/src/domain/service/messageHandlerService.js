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
            case 'whole_world':
                this._worldService.initWorld(msg.world);
                this._actionService.playActions(msg.actions);
                break;
            case 'entity_changed':
                this._worldService.updateEntity(msg.entity);
                break;
            case 'entity_born':
                this._worldService.giveBirthToEntity(msg.entity);
                break;
            case 'step_actions':
                this._actionService.playActions(msg.actions);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

}

export {
    MessageHandlerService
}