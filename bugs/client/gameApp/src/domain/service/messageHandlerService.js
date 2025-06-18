import { initConsts } from "@domain/consts";
import { CONSTS } from "@domain/consts";

class MessageHandlerService {

    constructor(mainEventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService) {
        this._mainEventBus = mainEventBus;
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._userService = userService;
        this._nuptialEnvironmentService = nuptialEnvironmentService;

        this._isStepMsgLoopInited = false;
        this._stepMessageQueue = [];

        this._serverConnection.events.on('message', this._onMessage.bind(this));
        this._serverConnection.events.on('connectionClosedFromServer', this._onConnectionClosedFromServer.bind(this));
    }

    connect(socketURL) {
        return this._serverConnection.connect(socketURL);
    }

    isConnected() {
        return this._serverConnection.isConnected();
    }

    _onMessage(msg) {
        switch(msg.type) {
            case 'init_step':
                this._handleInitStepMsg(msg);
                break;
            case 'step':
                this._onStepMsg(msg);
                break;
            case 'email_verified':
                this._handleEmailVerifiedMsg(msg);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

    _onStepMsg(msg) {
        if (!this._isStepMsgLoopInited) {
            this._startStepMessageProcessingLoop();
        }
        this._stepMessageQueue.push(msg);
    }

    _startStepMessageProcessingLoop() {
        if (this._isStepMsgLoopInited) {
            return;
        }
        this._isStepMsgLoopInited = true;
        setInterval(() => {
            if (this._stepMessageQueue.length > 3) {
                console.warn('step msg q is to long = ', this._stepMessageQueue.length);
            }
            
            if (this._stepMessageQueue.length === 0) return;
            const msg = this._stepMessageQueue.shift();
            this._handleStepMsg(msg);

        }, CONSTS.STEP_TIME * 1000);
    }

    _handleInitStepMsg(msg) {
        initConsts(msg.consts);
        this._userService.initNotifications(msg.notifications)
        this._worldService.initWorld(msg.world, msg.step, msg.season);
        this._worldService.initRating(msg.rating);
        this._nuptialEnvironmentService.init(msg.specie, msg.nuptialMales);
        this._mainEventBus.emit('initStepDone');
    }

    _handleStepMsg(msg) {
        this._worldService.setCurrentStep(msg.step, msg.season);
        this._mainEventBus.emit('stepStart', msg.step);
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
                case 'nuptial_environment':
                    this._nuptialEnvironmentService.playAction(action);
                    break;
            }
        }
        this._mainEventBus.emit(`stepSyncDone:${msg.step}`);
        this._mainEventBus.emit('stepDone', msg.step);
    }

    _handleEmailVerifiedMsg() {
        this._userService.verifyEmailForUser();
    }

    _onConnectionClosedFromServer() {
        this._mainEventBus.emit('connectionClosedFromServer');
    }

}

export {
    MessageHandlerService
}