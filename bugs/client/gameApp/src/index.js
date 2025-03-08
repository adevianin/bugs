import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';
import { readInitialData } from '@utils/readInitialData';
import { MessageMaster } from '@common/messages/messageMaster';
import { msgLibrariesPack } from '@messages/msgLibraries';

async function initApp() {
    let initialData = readInitialData();

    MessageMaster.init(msgLibrariesPack);

    let syncLayer = initSyncLayer(initialData);
    let domainFacade = initDomainLayer(syncLayer.apis, syncLayer.serverConnection, initialData);
    await initViewLayer(domainFacade);

    domainFacade.start();
}

initApp();
