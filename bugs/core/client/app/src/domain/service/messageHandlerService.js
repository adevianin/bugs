import { initConts } from "@domain/consts";

class MessageHandlerService {

    constructor(mainEventBus, serverConnection, worldService, colonyService, specieBuilderService, userService) {
        this._mainEventBus = mainEventBus;
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._specieBuilderService = specieBuilderService;
        this._userService = userService;
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
            case 'init_step':
                this._handleInitStepMsg(msg);
                break;
            case 'step':
                this._handleStepMsg(msg);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

    _handleInitStepMsg(msg) {
        initConts(msg.consts);
        this._userService.initNotifications(msg.notifications)
        this._worldService.initWorld(msg.world);
        this._worldService.setRating(msg.rating);
        this._specieBuilderService.initBuilder(msg.specie);
        this._mainEventBus.emit('initStepDone');
    }

    _handleStepMsg(msg) {
        this._worldService.setCurrentStep(msg.step);
        for (let action of msg.actions) {
            switch(action.actorType) {
                case 'entity':
                    this._worldService.playEntityAction(action)
                    break;
                case 'colony':
                    this._colonyService.playColonyAction(action);
                    break;
                case 'climate':
                    this._worldService.playClimateAction(action);
                    break;
                case 'user':
                    this._userService.playUserAction(action);
                    break;
                case 'rating':
                    this._worldService.playRatingAction(action);
                    break;
            }
        }
    }

}

export {
    MessageHandlerService
}