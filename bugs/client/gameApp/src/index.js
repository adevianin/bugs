import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';
import { readInitialData } from '@utils/readInitialData';

async function initApp() {
    let initialData = readInitialData();

    let syncLayer = initSyncLayer(initialData);
    let domainFacade = initDomainLayer(syncLayer.apis, syncLayer.serverConnection, initialData);
    await initViewLayer(domainFacade);

    domainFacade.start();
}

initApp();
