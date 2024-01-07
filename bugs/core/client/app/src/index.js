import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';
import { readInitialData } from '@utils/readInitialData';

let initialData = readInitialData();

let syncLayer = initSyncLayer();
let domainFacade = initDomainLayer({ 
    accountApi: syncLayer.accountApi,
    nestApi: syncLayer.nestApi,
    colonyApi: syncLayer.colonyApi,
    antApi: syncLayer.antApi,
}, syncLayer.serverConnection, initialData);
initViewLayer(domainFacade, initialData);
