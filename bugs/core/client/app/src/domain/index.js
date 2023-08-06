import { DomainFacade } from './domainFacade';
import { UserService } from './service/userService';
import { MessageHandlerService } from './service/messageHandlerService';
import { EventEmitter } from 'utils/eventEmitter';
import { WorldFactory } from './worldFactory';
import { ActionFactory } from './entity/action/actionFactory';
import { WorldService } from './service/worldService';
import { ActionService } from './service/actionService';
import { ColonyService } from './service/colonyService';

function initDomainLayer(apis, serverConnection, initialData) {
    let mainEventBus = new EventEmitter();
    let worldFactory = new WorldFactory(mainEventBus, apis.nestApi);
    let world = worldFactory.buildWorld();
    let actionFactory = new ActionFactory();

    let worldService = new WorldService(world, worldFactory, mainEventBus);
    let userService = new UserService(apis.userApi, initialData.user, mainEventBus);
    let colonyService = new ColonyService(apis.colonyApi, world, worldFactory, mainEventBus);
    let actionService = new ActionService(initialData.step_time, actionFactory, worldService, colonyService);
    let messageHandlerService = new MessageHandlerService(serverConnection, worldService, actionService, colonyService);

    let domainFacade = new DomainFacade(mainEventBus, userService, messageHandlerService, worldService, colonyService);

    domainFacade.start();

    return domainFacade;
}

export {
    initDomainLayer
}