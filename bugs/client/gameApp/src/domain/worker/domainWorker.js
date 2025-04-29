import { CONSTS } from "@domain/consts";

class DomainWorker {

    constructor(eventBus, entitySerializer, viewPointManager, requester, myStateCollector, worldStepEventsCollector, services) {
        this._eventBus = eventBus;
        this._entitySerializer = entitySerializer;
        this._viewPointManager = viewPointManager;
        this._requester = requester;

        this._worldService = services.worldService;
        this._accountService = services.accountService;
        this._colonyService = services.colonyService;
        this._userService = services.userService;
        this._nuptialEnvironmentService = services.nuptialEnvironmentService;
        this._nestService = services.nestService;
        this._antService = services.antService;
        this._messageHandlerService = services.messageHandlerService;

        this._myStateCollector = myStateCollector;
        this._worldStepEventsCollector = worldStepEventsCollector;

        this._listenIncomeMessages();

        this._entityActionAnimRequests = [];
        this._chunkMigrations = [];
        
    }

    _sendStepPack() {
        let visibleChunkIds = this._viewPointManager.getVisibleChunkIds();

        let entityAnimations = [];
        for (let entityActionAR of this._entityActionAnimRequests) {
            if (visibleChunkIds.includes(entityActionAR.chunkId)) {
                entityAnimations.push(entityActionAR);
            }
        }
        this._entityActionAnimRequests = [];

        let viewRectMigrations = [];
        for (let chunkMigration of this._chunkMigrations) {
            let entity = chunkMigration.entity;
            let isVisibleBefore = visibleChunkIds.includes(chunkMigration.prevChunkId);
            let isVisibleAfter = visibleChunkIds.includes(entity.chunkId);
            if (isVisibleBefore && !isVisibleAfter) {
                viewRectMigrations.push({ isMigrationIntoViewRect: false, entityId: entity.id  });
            } else if (!isVisibleBefore && isVisibleAfter) {
                viewRectMigrations.push({ isMigrationIntoViewRect: true, entity: this._entitySerializer.serializeAnyEntity(entity) });
            }
        }
        this._chunkMigrations = [];

        let myStatePatch = this._myStateCollector.pullPatch();

        let stepPack = {
            step: this._worldService.world.currentStep,
            season: this._worldService.world.currentSeason,
            dailyTemperature: this._worldService.world.climate.dailyTemperature,
            entityAnimations,
            viewRectMigrations,
            myStatePatch,
            worldEvents: this._worldStepEventsCollector.pullStepEvents()
        }
        
        this._sendMessage('stepPack', stepPack);
    }

    _handleCommand(command) {
        switch (command.type) {
            case 'init':
                this._handleInitCommand(command)
                break;
            // case 'findMyFirstNest':
            //     this._handleFindMyFirstNestCommand(command)
            //     break;
            case 'changePlayerViewPoint':
                this._handleChangePlayerViewPointCommand(command)
                break;
            case 'getEntitiesInCurrentViewRect':
                this._handleGetEntitiesInCurrentViewRectCommand(command)
                break;
            case 'getChunkShapesDebug':
                this._handleGetChunkShapesDebugCommand(command)
                break;
            case 'getEntityDataById':
                this._handleGetEntityDataByIdCommand(command)
                break;
            case 'getEnemyColonyData':
                this._handleGetEnemyColonyDataCommand(command)
                break;
            case 'buildMarker':
                this._handleBuildMarkerCommand(command)
                break;
            case 'saveSpecieSchema':
                this._handleSaveSpecieSchemaCommand(command)
                break;
            case 'bornNewAntara':
                this._handleBornNewAntaraCommand(command)
                break;
            case 'layEggInNest':
                this._handleLayEggInNestCommand(command)
                break;
            case 'changeEggNameInNest':
                this._handleChangeEggNameInNestCommand(command)
                break;
            case 'changeEggCasteInNest':
                this._handleChangeEggCasteInNestCommand(command)
                break;
            case 'moveEggToLarvaInNest':
                this._handleMoveEggToLarvaInNestCommand(command)
                break;
            case 'deleteEggInNest':
                this._handleDeleteEggInNestCommand(command)
                break;
            case 'deleteLarvaInNest':
                this._handleDeleteLarvaInNestCommand(command)
                break;
            case 'renameNest':
                this._handleRenameNestCommand(command)
                break;
            case 'antRelocate':
                this._handleAntRelocateCommand(command)
                break;
            case 'antChangeGuardianBehavior':
                this._handleAntChangeGuardianBehaviorCommand(command)
                break;
            case 'antToggleCooperativeBehavior':
                this._handleAntToggleCooperativeBehaviorCommand(command)
                break;
            case 'antFlyNuptialFlight':
                this._handleAntFlyNuptialFlightCommand(command)
                break;
            case 'getRaidableArea':
                this._handleGetRaidableAreaCommand(command)
                break;
            case 'getNestBuildableArea':
                this._handleGetNestBuildableAreaCommand(command)
                break;
            case 'validateBuildingNewNestPosition':
                this._handleValidateBuildingNewNestPositionCommand(command)
                break;
            case 'validateBreedingQueen':
                this._handleValidateBreedingQueenCommand(command)
                break;
            case 'validateNewNestOperationConditions':
                this._handleValidateNewNestOperationConditionsCommand(command)
                break;
            case 'validateBuildingSubNestPosition':
                this._handleValidateBuildingSubNestPositionCommand(command)
                break;
            case 'validateDestroyNestOperationConditions':
                this._handleValidateDestroyNestOperationConditionsCommand(command)
                break;
            case 'validateNestToDestroy':
                this._handleValidateNestToDestroyCommand(command)
                break;
            case 'validatePillageNestOperationConditions':
                this._handleValidatePillageNestOperationConditionsCommand(command)
                break;
            case 'validateNestToPillage':
                this._handleValidateNestToPillageCommand(command)
                break;
            case 'validateLayingEggInNest':
                this._handleValidateLayingEggInNestCommand(command)
                break;
            case 'foundColony':
                this._handleFoundColonyCommand(command)
                break;
            case 'stopOperation':
                this._handleStopOperationCommand(command)
                break;
            case 'buildNewSubNestOperation':
                this._handleBuildNewSubNestOperationCommand(command)
                break;
            case 'destroyNestOperation':
                this._handleDestroyNestOperationCommand(command)
                break;
            case 'pillageNestOperation':
                this._handlePillageNestOperationCommand(command)
                break;
            case 'transportFoodOperation':
                this._handleTransportFoodOperationCommand(command)
                break;
            case 'buildFortificationsOpearation':
                this._handleBuildFortificationsOpearationCommand(command)
                break;
            case 'logout':
                this._handleLogoutCommand(command)
                break;
            case 'changeUsername':
                this._handleChangeUsernameCommand(command)
                break;
            case 'changeEmail':
                this._handleChangeEmailCommand(command)
                break;
            case 'verifyEmailRequest':
                this._handleVerifyEmailRequestCommand(command)
                break;
            case 'validatePassword':
                this._handleValidatePasswordCommand(command)
                break;
            case 'changePassword':
                this._handleChangePasswordCommand(command)
                break;
            default:
                throw 'unknown type of command';
        }
    }

    _handleInitCommand(command) {
        let data = command.data;
        let userData = data.userData;
        let mainSocketURL = data.mainSocketURL;
        let csrftoken = data.csrftoken;

        this._userService.setUserData(userData);
        this._entitySerializer.setUserData(userData);
        this._requester.setCsrfToken(csrftoken);
        this._myStateCollector.setUserData(userData);

        this._eventBus.once('initStepDone', () => {
            this._viewPointManager.setChunks(this._worldService.world.chunks);
            this._listenWorldActivity();

            let initPack = {
                currentStep: this._worldService.world.currentStep,
                currentSeason: this._worldService.world.currentSeason,
                dailyTemperature: this._worldService.world.climate.dailyTemperature,
                worldSize: this._worldService.world.size,
                consts: CONSTS,
                myState: this._myStateCollector.getMyState(),
                rating: this._worldService.getRating()
            };
            this._sendCommandResult(command.id, initPack);
        });

        this._messageHandlerService.connect(mainSocketURL);
    }

    _listenWorldActivity() {
        this._eventBus.on('entityActionAnimationRequest', this._onEntityActionAnimationRequest.bind(this));
        this._eventBus.on('entityChunkMigration', this._onEntityChunkMigration.bind(this));
        this._eventBus.on('entityAddedToChunks', this._onEntityAddedToChunks.bind(this));
        this._eventBus.on('stepDone', this._onStepDone.bind(this));

        this._eventBus.on('emailVerified', this._onEmailVerified.bind(this));
        this._eventBus.on('ratingUpdated', this._onRatingUpdated.bind(this));
    }

    _handleChangePlayerViewPointCommand(command) {
        let data = command.data;
        let isSomeChunkVisibilityChanged = this._viewPointManager.updateChunksVisibleStateForViewRect(data.viewRect);
        let visibleEntities = [];
        if (isSomeChunkVisibilityChanged) {
            visibleEntities = this._viewPointManager.getEntitiesFromVisibleChunks();
            let serializedEntities = [];
            for (let entity of visibleEntities) {
                serializedEntities.push(this._entitySerializer.serializeAnyEntity(entity));
            }
            this._sendCommandResult(command.id, { isSomeChunkVisibilityChanged: true, entities: serializedEntities });
        } else {
            this._sendCommandResult(command.id, { isSomeChunkVisibilityChanged: false, entities: [] });
        }   
    }

    _handleGetEntitiesInCurrentViewRectCommand(command) {
        let visibleEntities = this._viewPointManager.getEntitiesFromVisibleChunks();
        let serializedEntities = this._entitySerializer.serializeAnyEntities(visibleEntities);
        this._sendCommandResult(command.id, serializedEntities);
    }

    _handleGetChunkShapesDebugCommand(command) {
        let chunkShapes = [];
        for (let chunk of Object.values(this._viewPointManager.chunks)) {
            chunkShapes.push(chunk.shape);
        }
        
        this._sendCommandResult(command.id, chunkShapes);
    }

    _handleGetEntityDataByIdCommand(command) {
        let data = command.data;
        let entityId = data.id;
        let entity = this._worldService.world.findEntityById(entityId);
        let entityData = entity ? this._entitySerializer.serializeAnyEntity(entity) : null;
        this._sendCommandResult(command.id, entityData);
    }

    _handleGetEnemyColonyDataCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let result = this._colonyService.getEnemyColonyData(colonyId);
        this._sendCommandResult(command.id, result);
    }

    _handleBuildMarkerCommand(command) {
        let data = command.data;
        let type = data.type;
        let point = data.point;
        let params = data.params;
        let marker = this._colonyService.buildMarker(type, point, params);
        this._sendCommandResult(command.id, marker);
    }

    _handleSaveSpecieSchemaCommand(command) {
        let data = command.data;
        let specieSchema = data.specieSchema;
        this._nuptialEnvironmentService.saveSpecieSchema(specieSchema);
        this._sendCommandResult(command.id, true);
    }

    async _handleBornNewAntaraCommand(command) {
        let data = command.data;
        await this._nuptialEnvironmentService.bornNewAntara();
        this._sendCommandResult(command.id, true);
    }

    async _handleLayEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let name = data.name;
        let isFertilized = data.isFertilized;
        let result = await this._nestService.layEggInNest(nestId, name, isFertilized);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangeEggNameInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        let name = data.name;
        await this._nestService.changeEggNameInNest(nestId, eggId, name);
        this._sendCommandResult(command.id, true);
    }

    async _handleChangeEggCasteInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        let antType = data.antType;
        await this._nestService.changeEggCasteInNest(nestId, eggId, antType);
        this._sendCommandResult(command.id, true);
    }

    async _handleMoveEggToLarvaInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        await this._nestService.moveEggToLarvaInNest(nestId, eggId);
        this._sendCommandResult(command.id, true);
    }

    async _handleDeleteEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        await this._nestService.deleteEggInNest(nestId, eggId);
        this._sendCommandResult(command.id, true);
    }

    async _handleDeleteLarvaInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let larvaId = data.larvaId;
        await this._nestService.deleteLarvaInNest(nestId, larvaId);
        this._sendCommandResult(command.id, true);
    }

    async _handleRenameNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let name = data.name;
        await this._nestService.renameNest(nestId, name);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntRelocateCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let homeNestId = data.homeNestId;
        await this._antService.antRelocate(antId, homeNestId);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntChangeGuardianBehaviorCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let behaviorValue = data.behaviorValue;
        await this._antService.antChangeGuardianBehavior(antId, behaviorValue);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntToggleCooperativeBehaviorCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let isCooperative = data.isCooperative;
        await this._antService.antToggleCooperativeBehavior(antId, isCooperative);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntFlyNuptialFlightCommand(command) {
        let data = command.data;
        let antId = data.antId;
        await this._antService.antFlyNuptialFlight(antId);
        this._sendCommandResult(command.id, true);
    }

    _handleGetRaidableAreaCommand(command) {
        let data = command.data;
        let raidingColonyId = data.raidingColonyId;
        let raidAreaCenter = data.raidAreaCenter;
        let chunkIds = this._viewPointManager.getVisibleChunkIds();
        let result = this._colonyService.getRaidableArea(raidingColonyId, raidAreaCenter, chunkIds);
        this._sendCommandResult(command.id, result);
    }

    _handleGetNestBuildableAreaCommand(command) {
        let data = command.data;
        let mainNestPosition = data.mainNestPosition;
        let chunkIds = this._viewPointManager.getVisibleChunkIds();
        let result = this._colonyService.getNestBuildableArea(mainNestPosition, chunkIds);
        this._sendCommandResult(command.id, result);
    }

    _handleValidateBuildingNewNestPositionCommand(command) {
        let data = command.data;
        let position = data.position;
        let errId = this._colonyService.validateBuildingNewNestPosition(position);
        this._sendCommandResult(command.id, errId);
    }

    _handleValidateBreedingQueenCommand(command) {
        let data = command.data;
        let queenId = data.queenId;
        let errId = this._colonyService.validateBreedingQueen(queenId);
        this._sendCommandResult(command.id, errId);
    }

    _handleValidateNewNestOperationConditionsCommand(command) {
        let data = command.data;
        let err = this._colonyService.validateNewNestOperationConditions(data.colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateBuildingSubNestPositionCommand(command) {
        let data = command.data;
        let position = data.position;
        let err = this._colonyService.validateBuildingSubNestPosition(position);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateDestroyNestOperationConditionsCommand(command) {
        let data = command.data;
        let err = this._colonyService.validateDestroyNestOperationConditions(data.colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateNestToDestroyCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._colonyService.validateNestToDestroy(nestId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidatePillageNestOperationConditionsCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let err = this._colonyService.validatePillageNestOperationConditions(colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateNestToPillageCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._colonyService.validateNestToPillage(nestId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateLayingEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._nestService.validateLayingEggInNest(nestId);
        this._sendCommandResult(command.id, err);
    }

    async _handleFoundColonyCommand(command) {
        let data = command.data;
        let queenId = data.queenId;
        let nuptialMaleId = data.nuptialMaleId;
        let nestBuildingSite = data.nestBuildingSite;
        let colonyName = data.colonyName;
        let result = await this._nuptialEnvironmentService.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
        this._sendCommandResult(command.id, result);
    }

    async _handleStopOperationCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let operationId = data.operationId;
        await this._colonyService.stopOperation(colonyId, operationId);
        this._sendCommandResult(command.id, true);
    }

    async _handleBuildNewSubNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let buildingSite = data.buildingSite;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let nestName = data.nestName;
        let result = await this._colonyService.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName);
        this._sendCommandResult(command.id, result);
    }

    async _handleDestroyNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let nestId = data.nestId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId);
        this._sendCommandResult(command.id, result);
    }

    async _handlePillageNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let pillagingNestId = data.pillagingNestId;
        let nestForLootId = data.nestForLootId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleTransportFoodOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let fromNestId = data.fromNestId;
        let toNestId = data.toNestId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleBuildFortificationsOpearationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let nestId = data.nestId;
        let workersCount = data.workersCount;
        let result = await this._colonyService.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleLogoutCommand(command) {
        let data = command.data;
        let redirectUrl = await this._accountService.logout();
        this._sendCommandResult(command.id, redirectUrl);
    }

    async _handleChangeUsernameCommand(command) {
        let data = command.data;
        let newUsername = data.newUsername;
        let result = await this._accountService.changeUsername(newUsername);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangeEmailCommand(command) {
        let data = command.data;
        let newEmail = data.newEmail;
        let password = data.password;
        let result = await this._accountService.changeEmail(newEmail, password);
        this._sendCommandResult(command.id, result);
    }

    async _handleVerifyEmailRequestCommand(command) {
        this._accountService.verifyEmailRequest();
    }

    async _handleValidatePasswordCommand(command) {
        let data = command.data;
        let password = data.password;
        let result = this._accountService.validatePassword(password);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangePasswordCommand(command) {
        let data = command.data;
        let newPassword = data.newPassword;
        let oldPassword = data.oldPassword;
        let result = await this._accountService.changePassword(newPassword, oldPassword);
        this._sendCommandResult(command.id, result);
    }

    _sendCommandResult(id, result) {
        this._sendMessage('commandResult', {
            id,
            result
        });
    }

    _sendEvent(type, data) {
        this._sendMessage('event', {
            type,
            data
        });
    }

    _sendMessage(type, data) {
        postMessage({
            type,
            data
        });
    }

    _listenIncomeMessages() {
        onmessage = (e) => {
            let msg = e.data;
            switch (msg.type) {
                case 'command':
                    this._handleCommand(msg.data);
                    break;
                default:
                    throw 'unknown type of message';
            }
        }
    }

    _onStepDone() {
        this._sendStepPack();
    }

    _onEntityActionAnimationRequest(chunkId, entityId, actionType, animationParams) {
        this._entityActionAnimRequests.push({
            chunkId, entityId, actionType, animationParams
        });
    }

    _onEntityChunkMigration(entity, prevChunkId) {
        this._chunkMigrations.push({
            entity, prevChunkId
        });
    }

    _onEntityAddedToChunks(entity) {
        this._chunkMigrations.push({
            entity, 
            prevChunkId: null
        });
    }

    _onEmailVerified() {
        this._sendEvent('emailVerified');
    }

    _onRatingUpdated() {
        this._sendEvent('ratingUpdated', { 
            rating: this._worldService.getRating() 
        });
    }

}

export {
    DomainWorker
}