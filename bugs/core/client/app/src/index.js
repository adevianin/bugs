import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';

let syncLayer = initSyncLayer();
let domainFacade = initDomainLayer(syncLayer.userApi, syncLayer.serverConnection);
initViewLayer(domainFacade);
