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

    _onMessage(msg) {
        switch(msg.type) {
            case 'whole_world':
                this._worldService.initWorld(msg.world);
                break;
            case 'entity_changed':
                this._worldService.updateEntity(msg.entity);
                break;
            case 'entity_born':
                this._worldService.addNewEntity(msg.entity);
                break;
            case 'entity_action':
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