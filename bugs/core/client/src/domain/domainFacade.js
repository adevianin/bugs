class DomainFacade {

    constructor(userService, messageHandlerService, worldService) {
        this._worldService = worldService;
        this._userService = userService;
        this._messageHandlerService = messageHandlerService;

        this._tryConnectMessageHandler();
    }

    getEntities() {
        return this._worldService.getEntities();
    }

    isLoggedIn() {
        return this._userService.isLoggedIn();
    }

    login(username, password) {
        return this._userService.login(username, password).then(() => {
            this._tryConnectMessageHandler();
        });
    }

    getUserData() {
        return this._userService.getUserData();
    }

    _tryConnectMessageHandler() {
        if (this._userService.isLoggedIn()) {
            this._messageHandlerService.connect();
        }
    }

}
export { DomainFacade }