import { DomainFacade } from './domainFacade';
import { WorldFactory } from './worldFactory';
import EventEmitter from 'events';

function initDomainLayer() {
    let main_event_bus = new EventEmitter();
    let worldFactory = new WorldFactory(main_event_bus);
    let domainFacade = new DomainFacade(worldFactory);

    return domainFacade;
}

export {
    initDomainLayer
}