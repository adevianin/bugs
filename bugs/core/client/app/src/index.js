import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';
import { readInitialData } from 'utils/readInitialData';

let initialData = readInitialData();

let syncLayer = initSyncLayer();
let domainFacade = initDomainLayer({ 
    userApi: syncLayer.userApi,
    nestApi: syncLayer.nestApi,
    colonyApi: syncLayer.colonyApi
}, syncLayer.serverConnection, initialData);
initViewLayer(domainFacade, initialData);
