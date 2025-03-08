import { BaseDomainFacade } from "@common/domain/baseDomainFacade";

class DomainFacade extends BaseDomainFacade {

    constructor(accountService) {
        super();
        this._accountService = accountService;
    }

}

export {
    DomainFacade
}