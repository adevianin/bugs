class DomainFacade {

    constructor(mainEventBus, accountService, messageHandlerService, worldService, colonyService, nuptialService) {
        this._mainEventBus = mainEventBus;
        this._worldService = worldService;
        this._accountService = accountService;
        this._messageHandlerService = messageHandlerService;
        this._colonyService = colonyService;
        this._nuptialService = nuptialService;
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
        return this._accountService.isLoggedIn();
    }

    login(username, password) {
        return this._accountService.login(username, password).then(() => {
            this._tryConnectMessageHandler();
        });
    }

    register(username, password) {
        return this._accountService.register(username, password).then(() => {
            this._tryConnectMessageHandler();
        });
    }

    logout() {
        return this._accountService.logout().then(() => {
            this._disconnectMessagerHandler();
            this._worldService.clear();
        });
    }

    checkUsernameUnique(username) {
        return this._accountService.checkUsernameUnique(username);
    }

    getUserData() {
        return this._accountService.getUserData();
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

    getAntsFromColony(colonyId) {
        return this._worldService.world.findAntsFromColony(colonyId);
    }

    getQueenOfColony(colonyId) {
        return this._worldService.world.getQueenOfColony(colonyId);
    }

    isNestMine(nest) {
        let userData = this.getUserData();
        let colony = this._worldService.world.findColonyById(nest.fromColony);
        return colony.ownerId == userData.id;
    }

    getMyQueensInNuptialFlight() {
        let userData = this.getUserData();
        return this._worldService.getQueensInNuptialFlightFromUser(userData.id);
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

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        this._colonyService.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
    }

    /*========================*/

    searchNuptialMales() {
        return this._nuptialService.searchNuptialMales();
    }

    findNearestNestForOffensiveOperation(performingColonyId, point) {
        return this._worldService.findNearestNestForOffensiveOperation(performingColonyId, point);
    }

    _tryConnectMessageHandler() {
        if (this._accountService.isLoggedIn()) {
            this._messageHandlerService.connect();
        }
    }

    _disconnectMessagerHandler() {
        this._messageHandlerService.disconnect();
    }

}
export { DomainFacade }