import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';

let domainFacade = initDomainLayer();
initSyncLayer(domainFacade);
initViewLayer(domainFacade);
