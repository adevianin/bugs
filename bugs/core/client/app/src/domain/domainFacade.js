class DomainFacade {

    constructor(mainEventBus, userService, messageHandlerService, worldService, operationService) {
        this._mainEventBus = mainEventBus;
        this._worldService = worldService;
        this._userService = userService;
        this._messageHandlerService = messageHandlerService;
        this._operationService = operationService;
    }

    get events() {
        return this._mainEventBus;
    }

    getEntities() {
        return this._worldService.getEntities();
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

    findMyQueen() {
        let userData = this.getUserData();
        return this._worldService.findMyQueen(userData.id);
    }

    buildNewNest(position) {
        this._operationService.buildNewNest(position);
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