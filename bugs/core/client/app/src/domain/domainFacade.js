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

    isNestMine(nest) {
        let userData = this.getUserData();
        let colony = this._worldService.world.findColonyById(nest.fromColony);
        return colony.ownerId == userData.id;
    }

    /*======operations========*/

    stopOperation(colonyId, operationId) {
        this._colonyService.stopOperation(colonyId, operationId);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount) {
        this._colonyService.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount);
    }

    destroyNestOperation(performingColonyId, warriorsCount, nest) {
        this._colonyService.destroyNestOperation(performingColonyId, warriorsCount, nest);
    }

    /*========================*/

    findNearestNestForOffensiveOperation(performingColonyId, point) {
        return this._worldService.findNearestNestForOffensiveOperation(performingColonyId, point);
    }








    // findMyColony() {
    //     let userData = this.getUserData();
    //     return this._worldService.world.findColonyByOwnerId(userData.id);
    // }

    findMyQueen() {
        let userData = this.getUserData();
        return this._worldService.world.findQueenByOwnerId(userData.id);
    }

    pillageNestOperation(pillagingNest, unloadingNest) {
        this._colonyService.pillageNestOperation(pillagingNest, unloadingNest);
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