class MessageHandlerService {

    constructor(mainEventBus, serverConnection, worldService, colonyService, specieBuilderService) {
        this._mainEventBus = mainEventBus;
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._specieBuilderService = specieBuilderService;
        this._serverConnection.events.on('message', this._onMessage.bind(this));
    }

    connect() {
        return this._serverConnection.connect();
    }

    disconnect() {
        this._serverConnection.disconnect();
    }

    _onMessage(msg) {
        switch(msg.type) {
            case 'sync_step':
                this._handleSyncStepMsg(msg);
                break;
            case 'action':
                this._handleActionMsg(msg);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

    _handleActionMsg(msg) {
        let action = msg.action;
        switch(action.actorType) {
            case 'entity':
                this._worldService.playEntityAction(action)
                break;
            case 'colony':
                this._colonyService.playColonyAction(action);
                break;
        }
    }

    _handleSyncStepMsg(msg) {
        this._worldService.initWorld(msg.world);
    }

}

export {
    MessageHandlerService
}