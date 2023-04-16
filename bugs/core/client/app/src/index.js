import './view/styles/index.css';

import { initSyncLayer } from './sync';
import { initDomainLayer } from './domain';
import { initViewLayer } from './view';
import { readInitialData } from 'utils/readInitialData';

let initialData = readInitialData();

let syncLayer = initSyncLayer();
let domainFacade = initDomainLayer(syncLayer.userApi, syncLayer.serverConnection, initialData);
initViewLayer(domainFacade, initialData);
