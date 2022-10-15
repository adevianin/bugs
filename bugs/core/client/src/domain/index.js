import { DomainFacade } from './domainFacade';
import { WorldFactory } from './worldFactory';

function initDomainLayer() {
    let worldFactory = new WorldFactory();
    let domainFacade = new DomainFacade(worldFactory);

    return domainFacade;
}

export {
    initDomainLayer
}