import { initConts } from "@domain/consts";

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
        this._worldService.initWorld(msg.world);
        this._specieBuilderService.initBuilder(msg.specie);
        this._mainEventBus.emit('initStepDone');
        this._handleActions(msg.step, msg.actions);
    }

    _handleStepMsg(msg) {
        this._handleActions(msg.step, msg.actions);
    }

    _handleActions(stepNumber, actions) {
        console.log(actions);
        this._worldService.setCurrentStep(stepNumber);
        for (let action of actions) {
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
            }
        }
    }

}

export {
    MessageHandlerService
}