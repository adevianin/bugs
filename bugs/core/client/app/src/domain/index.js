import { DomainFacade } from './domainFacade';
import { UserService } from './service/userService';
import { MessageHandlerService } from './service/messageHandlerService';
import { EventEmitter } from 'utils/eventEmitter';
import { WorldFactory } from './worldFactory';
import { ActionFactory } from './entity/action/actionFactory';
import { WorldService } from './service/worldService';
import { ActionService } from './service/actionService';

function initDomainLayer(userApi, serverConnection) {
    let initialData = JSON.parse(document.getElementById('initial-data').innerText);

    let mainEventBus = new EventEmitter();
    let worldFactory = new WorldFactory(mainEventBus);
    let world = worldFactory.buildWorld();
    let actionFactory = new ActionFactory(world);

    let worldService = new WorldService(world, worldFactory);
    let userService = new UserService(userApi, initialData.user);
    let actionService = new ActionService(actionFactory, world);
    let messageHandlerService = new MessageHandlerService(serverConnection, worldService, actionService);

    let domainFacade = new DomainFacade(userService, messageHandlerService, worldService);

    return domainFacade;
}

export {
    initDomainLayer
}