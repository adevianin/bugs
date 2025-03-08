class BaseDomainFacade {

    constructor(mainEventBus, accountService) {
        this._mainEventBus = mainEventBus;
        this._accountService = accountService;
    }

    get events() {
        return this._mainEventBus;
    }

    logout() {
        return this._accountService.logout();
    }

    getUserData() {
        return this._accountService.getUserData();
    }

}
export { BaseDomainFacade }