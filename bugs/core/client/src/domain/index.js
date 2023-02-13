import { DomainFacade } from './domainFacade';

function initDomainLayer() {
    let domainFacade = new DomainFacade();

    return domainFacade;
}

export {
    initDomainLayer
}