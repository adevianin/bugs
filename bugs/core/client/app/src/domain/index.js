import { DomainFacade } from './domainFacade';
import { AccountService } from './service/accountService';
import { MessageHandlerService } from './service/messageHandlerService';
import { EventEmitter } from '@utils/eventEmitter';
import { WorldFactory } from './worldFactory';
import { WorldService } from './service/worldService';
import { ColonyService } from './service/colonyService';
import { NuptialService } from './service/nuptialService';

function initDomainLayer(apis, serverConnection, initialData) {
    let mainEventBus = new EventEmitter();
    let worldFactory = new WorldFactory(mainEventBus, apis.nestApi, apis.antApi);
    let world = worldFactory.buildWorld();

    let worldService = new WorldService(world, worldFactory, mainEventBus);
    let accountService = new AccountService(apis.accountApi, initialData.user, mainEventBus);
    let colonyService = new ColonyService(apis.colonyApi, world, worldFactory, mainEventBus);
    let nuptialService = new NuptialService(apis.nuptialApi);
    let messageHandlerService = new MessageHandlerService(serverConnection, worldService, colonyService);

    let domainFacade = new DomainFacade(mainEventBus, accountService, messageHandlerService, worldService, colonyService, nuptialService);

    domainFacade.start();

    return domainFacade;
}

export {
    initDomainLayer
}