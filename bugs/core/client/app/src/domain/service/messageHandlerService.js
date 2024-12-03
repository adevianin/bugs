import { initConts } from "@domain/consts";

class MessageHandlerService {

    constructor(mainEventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService) {
        this._mainEventBus = mainEventBus;
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._userService = userService;
        this._nuptialEnvironmentService = nuptialEnvironmentService;
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
        this._worldService.initWorld(msg.world, msg.step, msg.season);
        this._worldService.setRating(msg.rating);
        this._nuptialEnvironmentService.init(msg.specie, msg.nuptialMales);
        this._mainEventBus.emit('initStepDone');
    }

    _handleStepMsg(msg) {
        this._worldService.setCurrentStep(msg.step, msg.season);
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
                case 'nuptial':
                    this._nuptialEnvironmentService.playAction(action);
                    break;
            }
        }
    }

}

export {
    MessageHandlerService
}