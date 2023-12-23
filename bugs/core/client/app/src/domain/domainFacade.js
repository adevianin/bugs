class DomainFacade {

    constructor(mainEventBus, userService, messageHandlerService, worldService, colonyService) {
        this._mainEventBus = mainEventBus;
        this._worldService = worldService;
        this._userService = userService;
        this._messageHandlerService = messageHandlerService;
        this._colonyService = colonyService;
    }

    get events() {
        return this._mainEventBus;
    }

    getEntities() {
        return this._worldService.world.entities;
    }

    findEntityById(id) {
        return this._worldService.world.findEntityById(id);
    }

    isLoggedIn() {
        return this._userService.isLoggedIn();
    }

    login(username, password) {
        return this._userService.login(username, password).then(() => {
            this._tryConnectMessageHandler();
        });
    }

    register(username, password) {
        return this._userService.register(username, password).then(() => {
            this._tryConnectMessageHandler();
        });
    }

    logout() {
        return this._userService.logout().then(() => {
            this._disconnectMessagerHandler();
            this._worldService.clear();
        });
    }

    checkUsernameUnique(username) {
        return this._userService.checkUsernameUnique(username);
    }

    getUserData() {
        return this._userService.getUserData();
    }

    start() {
        this._tryConnectMessageHandler();
    }

    isWholeWorldInited() {
        return this._worldService.isWholeWorldInited();
    }

    getWorldSize() {
        return this._worldService.world.size;
    }

    findMyColonies() {
        let userData = this.getUserData();
        return this._worldService.world.findColoniesByOwnerId(userData.id);
    }

    getNestsFromColony(colonyId) {
        return this._worldService.world.findNestsFromColony(colonyId);
    }

    getQueenOfColony(colonyId) {
        return this._worldService.world.findQueenFromColony(colonyId);
    }

    stopOperation(colonyId, operationId) {
        this._colonyService.stopOperation(colonyId, operationId);
    }

    buildNewSubNestOperation(colonyId, buildingSite, workersCount) {
        this._colonyService.buildNewSubNestOperation(colonyId, buildingSite, workersCount);
    }




    // findMyColony() {
    //     let userData = this.getUserData();
    //     return this._worldService.world.findColonyByOwnerId(userData.id);
    // }

    findMyQueen() {
        let userData = this.getUserData();
        return this._worldService.world.findQueenByOwnerId(userData.id);
    }

    isNestMine(nest) {
        let userData = this.getUserData();
        let colony = this._worldService.world.findColonyById(nest.fromColony);
        return colony.ownerId == userData.id;
    }

    // buildNewNest(position) {
    //     this._colonyService.buildNewNest(position);
    // }

    destroyNestOperation(nest) {
        this._colonyService.destroyNestOperation(nest);
    }

    pillageNestOperation(pillagingNest, unloadingNest) {
        this._colonyService.pillageNestOperation(pillagingNest, unloadingNest);
    }

    // stopMyColonyOperation(operationId) {
    //     this._colonyService.stopMyColonyOperation(operationId);
    // }

    findNearestNestForOffensiveOperation(point) {
        let userData = this.getUserData();
        let myColony = this._worldService.world.findColonyByOwnerId(userData.id);
        return this._worldService.findNearestNestForOffensiveOperation(point, myColony.id);
    }

    findMyNearestNestForOperation(point) {
        let userData = this.getUserData();
        let myColony = this._worldService.world.findColonyByOwnerId(userData.id);
        return this._worldService.findMyNearestNestForOperation(point, myColony.id);
    }

    _tryConnectMessageHandler() {
        if (this._userService.isLoggedIn()) {
            this._messageHandlerService.connect();
        }
    }

    _disconnectMessagerHandler() {
        this._messageHandlerService.disconnect();
    }

}
export { DomainFacade }