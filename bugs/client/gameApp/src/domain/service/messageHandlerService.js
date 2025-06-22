import { initConsts } from "@domain/consts";
import { CONSTS } from "@domain/consts";

class MessageHandlerService {

    static MAX_STEP_MSGS_Q = 5;

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

        if (this._stepMessageQueue.length > MessageHandlerService.MAX_STEP_MSGS_Q) {
            console.warn('step msgs queue is too long = ', this._stepMessageQueue.length, '. messages arent handling, closing server connection');
            this._serverConnection.disconnect();
        }
    }

    _startStepMessageProcessingLoop() {
        if (this._isStepMsgLoopInited) {
            return;
        }
        this._isStepMsgLoopInited = true;
        let delay = CONSTS.STEP_TIME * 1000;

        let processNext = () => {
            this._handleNextStepMsg();

            let delayMultiplier = 1;

            switch (this._stepMessageQueue.length) {
                case 0:
                    delayMultiplier = 1;
                    break;
                case 1:
                    delayMultiplier = 0.97;
                    break;
                case 2:
                    delayMultiplier = 0.93;
                    break;
                case 3:
                    delayMultiplier = 0.8;
                    break;
                default:
                    delayMultiplier = 0.6;
            }

            setTimeout(processNext, delay * delayMultiplier);
        };

        processNext();
    }

    _handleNextStepMsg() {
        if (this._stepMessageQueue.length > 0) {
            let msg = this._stepMessageQueue.shift();
            this._handleStepMsg(msg);
        }
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