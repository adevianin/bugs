import { initConsts } from "@domain/consts";
import { MyStateViewModel } from "./myState/myStateViewModel";
import { RatingContainerViewModel } from "./myState/ratingContainerViewModel";

class DomainFacade {

    constructor(eventBus, domainWorker) {
        this._eventBus = eventBus;
        this._domainWorker = domainWorker;

        this._pendingCommands = {};
        this._lastUsedCommandId = 0;

        this._currentStep = null;
        this._currentSeason = null;
        this._dailyTemperature = null;
        this._worldSize = null;
        this._myState = null;

        this._domainWorker.onmessage = this._onMessage.bind(this);
    }

    get events() {
        return this._eventBus;
    }

    get myState() {
        return this._myState;
    }

    get currentStep() {
        return this._currentStep;
    }

    get currentSeason() {
        return this._currentSeason;
    }

    get dailyTemperature() {
        return this._dailyTemperature;
    }

    get ratingContainer() {
        return this._ratingContainer;
    }

    async init(userData, mainSocketURL, csrftoken) {
        this._userData = userData;
        let initPack = await this._sendCommand('init', {
            userData, mainSocketURL, csrftoken
        }, true);
        initConsts(initPack.consts);
        this._currentStep = initPack.currentStep;
        this._currentSeason = initPack.currentSeason;
        this._dailyTemperature = initPack.dailyTemperature;
        this._worldSize = initPack.worldSize;
        this._myState = MyStateViewModel.buildFromJson(initPack.myState);
        this._ratingContainer = RatingContainerViewModel.buildFromJson({rating: initPack.rating});
        this._eventBus.emit('worldInited');
    }

    changePlayerViewPoint(viewPoint, viewRect) {
        return this._sendCommand('changePlayerViewPoint', {
            viewPoint, viewRect
        }, true);
    }

    getEntitiesInCurrentViewRect() {
        return this._sendCommand('getEntitiesInCurrentViewRect', null, true);
    }

    getChunkShapesDebug() {
        return this._sendCommand('getChunkShapesDebug', null, true);
    }

    async _sendCommand(type, data, waitResult = false) {
        this._lastUsedCommandId++;
        let commandId = this._lastUsedCommandId;
        this._sendMessage('command', {
            type: type,
            id: commandId,
            data,
        });
        if (waitResult) {
            let commandData = {};
            let commandPromise = new Promise((res, rej) => {
                commandData.resolve = res;
                commandData.reject = rej;
            });
            this._pendingCommands[commandId] = commandData;
            let result = await commandPromise;
            delete this._pendingCommands[commandId];
            return result;
        }
    }

    _sendMessage(type, data = {}) {
        this._domainWorker.postMessage({
            type,
            data
        });
    }

    _onMessage(e) {
        let msg = e.data;
        switch (msg.type) {
            case 'commandResult':
                this._handleCommandResultMessage(msg.data);
                break;
            case 'stepPack':
                this._handleStepPackMessage(msg.data);
                break;
            case 'event':
                this._handleEventMessage(msg.data);
                break;
            default:
                throw 'unknown type of message';
        }
    }

    _handleCommandResultMessage(command) {
        if (this._pendingCommands[command.id]) {
            this._pendingCommands[command.id].resolve(command.result);
        }
    }

    _handleStepPackMessage(stepPack) {
        this._currentStep = stepPack.step;
        let isSeasonChanged = this._currentSeason != stepPack.season;
        this._currentSeason = stepPack.season;
        this._dailyTemperature = stepPack.dailyTemperature;
        this._myState.applyPatch(stepPack.myStatePatch);
        this._eventBus.emit('stepPack', stepPack);
        this._eventBus.emit('currentStepChanged', this._currentStep);
        if (isSeasonChanged) {
            this._eventBus.emit('currentSeasonChanged', this._currentSeason);
        }
        for (let worldEventRecord of stepPack.worldEvents) {
            this._eventBus.emit(`worldStepEvent:${worldEventRecord.type}`, worldEventRecord.data);
        }
    }

    _handleEventMessage({ type, data }) {
        switch(type) {
            case 'emailVerified':
                this._onEmailVerifiedEvent();
                break;
            case 'ratingUpdated':
                this._onRatingUpdatedEvent(data);
                break;
            default:
                throw 'unknown type of event';
        }
    }

    _onEmailVerifiedEvent() {
        this._userData.isEmailVerified = true;
        this._eventBus.emit('emailVerified');
    }

    _onRatingUpdatedEvent({ rating }) {
        this._ratingContainer.ratingPlaces = rating;
    }

    // get notificationsContainer() {
    //     return this._userService.notificationsContainer;
    // }

    // get ratingContainer() {
    //     return this._worldService.ratingContainer;
    // }

    // get world() {
    //     return this._worldService.world;
    // }

    getEntities() {
        return [];
    }

    async getEntityDataById(id) {
        return await this._sendCommand('getEntityDataById', {
            id
        }, true);
    }

    getWorldSize() {
        return this._worldSize;
    }

    getMyNestsFromMyColony(colonyId) {
        return this._myState.getNestsFromColony(colonyId);
    }

    // getQueenOfColony(colonyId) {
    //     return this._worldService.world.getQueenOfColony(colonyId);
    // }

    getMainNestOfMyColony(colonyId) {
        return this._myState.getMainNestOfColony(colonyId);
    }

    getEnemyColonyData(colonyId) {
        return this._sendCommand('getEnemyColonyData', {colonyId}, true);
    }

    // getColoniesByIds(ids) {
    //     return this._worldService.getColoniesByIds(ids);
    // }

    // isEntityMy(entity) {
    //     let userData = this.getUserData();
    //     return entity.ownerId == userData.id;
    // }

    // isMyAnt(entity) {
    //     return this.isEntityMy(entity) && entity.type == EntityTypes.ANT;
    // }

    // isColonyMy(colony) {
    //     let userData = this.getUserData();
    //     return colony.ownerId == userData.id;
    // }

    // isAnyMyAnt() {
    //     let userData = this.getUserData();
    //     return this._worldService.world.isAnyAntByOwnerId(userData.id);
    // }

    // getMyQueensInNuptialFlight() {
    //     let userData = this.getUserData();
    //     return this._nuptialEnvironmentService.getQueensInNuptialFlightFromUser(userData.id);
    // }

    // getClimate() {
    //     return this._worldService.world.climate;
    // }

    buildMarker(type, point, params) {
        return this._sendCommand('buildMarker', {
            type, point, params
        }, true);
    }

    findMyFirstNest() {
        return this._myState.findFirstNest();
    }

    // /*======operations========*/

    stopOperation(colonyId, operationId) {
        return this._sendCommand('stopOperation', {
            colonyId, operationId
        }, true);
    }

    getNestBuildableArea(mainNestPosition) {
        return this._sendCommand('getNestBuildableArea', {
            mainNestPosition
        }, true);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return this._sendCommand('buildNewSubNestOperation', {
            performingColonyId, buildingSite, workersCount, warriorsCount, nestName
        }, true);
    }

    getRaidableArea(raidingColonyId, raidAreaCenter) {
        return this._sendCommand('getRaidableArea', {
            raidingColonyId,
            raidAreaCenter
        }, true);
    }

    destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId) {
        return this._sendCommand('destroyNestOperation', {
            performingColonyId, warriorsCount, workersCount, nestId
        }, true);
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        return this._sendCommand('pillageNestOperation', {
            performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount
        }, true);
    }

    transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        return this._sendCommand('transportFoodOperation', {
            performingColonyId, fromNestId, toNestId, workersCount, warriorsCount
        }, true);
    }

    // buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
    //     return this._colonyService.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
    // }

    // bringBugOpearation(performingColonyId, nestId) {
    //     return this._colonyService.bringBugOpearation(performingColonyId, nestId);
    // }

    // /*========================*/

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        return this._sendCommand('foundColony', {
            queenId, nuptialMaleId, nestBuildingSite, colonyName
        }, true);
    }

    // findNearestNest(point, excludeColonyId) {
    //     return this._nestService.findNearestNest(point, excludeColonyId);
    // }

    // getMySpecie() {
    //     return this._nuptialEnvironmentService.specie;
    // }

    saveSpecieSchema() {
        this._sendCommand('saveSpecieSchema', {
            specieSchema: this._myState.nuptialEnvironment.specie.schema
        }, true);
    }

    bornNewAntara() {
        return this._sendCommand('bornNewAntara', null, true);
    }

    layEggInNest(nestId, name, isFertilized) {
        return this._sendCommand('layEggInNest', {
            nestId, name, isFertilized
        }, true);
    }

    changeEggCasteInNest(nestId, eggId, antType) {
        return this._sendCommand('changeEggCasteInNest', {
            nestId, eggId, antType
        }, true);
    }

    changeEggNameInNest(nestId, eggId, name) {
        return this._sendCommand('changeEggNameInNest', {
            nestId, eggId, name
        }, true);
    }

    moveEggToLarvaInNest(nestId, eggId) {
        return this._sendCommand('moveEggToLarvaInNest', {
            nestId, eggId
        }, true);
    }

    deleteEggInNest(nestId, eggId) {
        return this._sendCommand('deleteEggInNest', {
            nestId, eggId
        }, true);
    }

    deleteLarvaInNest(nestId, larvaId) {
        return this._sendCommand('deleteLarvaInNest', {
            nestId, larvaId
        }, true);
    }

    renameNest(nestId, name) {
        return this._sendCommand('renameNest', {
            nestId, name
        }, true);
    }

    // findClosestBugCorpseNearNest(nestId) {
    //     return this._colonyService.findClosestBugCorpseNearNest(nestId);
    // }

    // /*==========ant===========*/

    antFlyNuptialFlight(antId) {
        return this._sendCommand('antFlyNuptialFlight', {
            antId
        }, true);
    }

    antChangeGuardianBehavior(antId, behaviorValue) {
        return this._sendCommand('antChangeGuardianBehavior', {
            antId, behaviorValue
        }, true);
    }

    antToggleCooperativeBehavior(antId, isCooperative) {
        return this._sendCommand('antToggleCooperativeBehavior', {
            antId, isCooperative
        }, true);
    }

    antRelocate(antId, homeNestId) {
        return this._sendCommand('antRelocate', {
            antId, homeNestId
        }, true);
    }

    // /*========================*/

    // /*==========account===========*/

    logout() {
        return this._sendCommand('logout', null, true);
    }

    getUserData() {
        return this._userData;
    }

    verifyEmailRequest() {
        this._sendCommand('verifyEmailRequest',null, false);
    }

    async changeUsername(newUsername) {
        let result = await this._sendCommand('changeUsername', {newUsername}, true);
        if (result.success) {
            this._userData = result.userData;
            return null;
        } else {
            return result.err;
        }
    }

    async changeEmail(newEmail, password) {
        let result = await this._sendCommand('changeEmail', {newEmail, password}, true);
        if (result.success) {
            this._userData = result.userData;
            return null;
        } else {
            return result.err;
        }
    }

    changePassword(newPassword, oldPassword) {
        return this._sendCommand('changePassword', {newPassword, oldPassword}, true);
    }

    validatePassword(password) {
        return this._sendCommand('validatePassword', {password}, true);
    }

    // /*==============================*/

    // /*======= game validators========*/
    
    validateBuildingNewNestPosition(position) {
        return this._sendCommand('validateBuildingNewNestPosition', {position}, true);
    }

    validateBreedingQueen(queenId) {
        return this._sendCommand('validateBreedingQueen', {queenId}, true);
    }

    validateNewNestOperationConditions(colonyId) {
        return this._sendCommand('validateNewNestOperationConditions', {colonyId}, true);
    }

    validateBuildingSubNestPosition(position) {
        return this._sendCommand('validateBuildingSubNestPosition', {position}, true);
    }

    validateDestroyNestOperationConditions(colonyId) {
        return this._sendCommand('validateDestroyNestOperationConditions', {colonyId}, true);
    }

    validateNestToDestroy(nestId) {
        return this._sendCommand('validateNestToDestroy', {nestId}, true);
    }

    validatePillageNestOperationConditions(colonyId) {
        return this._sendCommand('validatePillageNestOperationConditions', {colonyId}, true);
    }

    validateNestToPillage(nestId) {
        return this._sendCommand('validateNestToPillage', {nestId}, true);
    }

    validateLayingEggInNest(nestId) {
        return this._sendCommand('validateLayingEggInNest', {nestId}, true);
    }

    // /*==============================*/

}
export { DomainFacade }