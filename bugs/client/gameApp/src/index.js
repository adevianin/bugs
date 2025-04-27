import { initViewLayer } from './view';
import { DomainFacade } from '@view/domainFacade';
import { readInitialData } from '@common/utils/readInitialData';
import { getCookie } from '@common/utils/getCookie';
import { EventEmitter } from '@common/utils/eventEmitter';

async function initApp() {
    let initialData = readInitialData();

    let domainWorker = new Worker(`${STATIC_CLIENT_PATH}/domainWorker.js`);
    let eventBus = new EventEmitter();
    let domainFacade = new DomainFacade(eventBus, domainWorker);
    await initViewLayer(domainFacade);

    domainFacade.init(initialData.user, initialData.mainSocketURL, getCookie('csrftoken'));
}

initApp();
