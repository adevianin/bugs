import { DomainFacade } from './domainFacade';
import { AccountService } from './service/accountService';
import { MessageHandlerService } from './service/messageHandlerService';
import { EventEmitter } from '@utils/eventEmitter';
import { WorldFactory } from './worldFactory';
import { WorldService } from './service/worldService';
import { ColonyService } from './service/colonyService';
import { UserService } from './service/userService';
import { NuptialEnvironmentService } from './service/nuptialEnvironmentService';
import { NestService } from './service/nestService';
import { NotificationsContainer } from './entity/notificationsContainer';
import { RatingContainer } from './entity/ratingContainer';
import { NuptialEnvironmentFactory } from './entity/nuptialEnvironment/nuptialEnvironmentFactory';

function initDomainLayer(apis, serverConnection, initialData) {
    let mainEventBus = new EventEmitter();

    let worldFactory = new WorldFactory(mainEventBus, apis.antApi);
    let nuptialEnvironmentFactory = new NuptialEnvironmentFactory();

    let notificationsContainer = new NotificationsContainer();
    let ratingContainer = new RatingContainer();
    let world = worldFactory.buildWorld();

    let worldService = new WorldService(world, worldFactory, mainEventBus, ratingContainer);
    let accountService = new AccountService(apis.accountApi, initialData.user);
    let colonyService = new ColonyService(mainEventBus, world, apis.colonyApi, worldFactory);
    let userService = new UserService(apis.userApi, notificationsContainer);
    let nuptialEnvironmentService = new NuptialEnvironmentService(mainEventBus, world, nuptialEnvironmentFactory, apis.nuptialEnvironmentApi);
    let nestService = new NestService(mainEventBus, world, apis.nestApi);
    let messageHandlerService = new MessageHandlerService(mainEventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService);

    let domainFacade = new DomainFacade(mainEventBus, accountService, messageHandlerService, worldService, colonyService, userService, nuptialEnvironmentService, nestService);

    return domainFacade;
}

export {
    initDomainLayer
}