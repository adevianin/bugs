import { DomainFacade } from './domainFacade';
import { AccountService } from './service/accountService';
import { MessageHandlerService } from './service/messageHandlerService';
import { EventEmitter } from '@utils/eventEmitter';
import { WorldFactory } from './worldFactory';
import { WorldService } from './service/worldService';
import { ColonyService } from './service/colonyService';
import { NuptialService } from './service/nuptialService';
import { UserService } from './service/userService';
import { SpecieBuilderService } from './service/specieBuilderService';
import { SpecieFactory } from './entity/specieBuilder/specieFactory';
import { NotificationsContainer } from './entity/notificationsContainer';
import { RatingContainer } from './entity/ratingContainer';
import { NuptialMalesContainer } from './entity/nuptialMalesContainer';

function initDomainLayer(apis, serverConnection, initialData) {
    let mainEventBus = new EventEmitter();

    let worldFactory = new WorldFactory(mainEventBus, apis.nestApi, apis.antApi);
    let specieFactory = new SpecieFactory();

    let notificationsContainer = new NotificationsContainer();
    let nuptialMalesContainer = new NuptialMalesContainer();
    let ratingContainer = new RatingContainer();
    let world = worldFactory.buildWorld();

    let worldService = new WorldService(world, worldFactory, mainEventBus, ratingContainer);
    let accountService = new AccountService(apis.accountApi, initialData.user, mainEventBus);
    let colonyService = new ColonyService(apis.colonyApi, world, worldFactory, mainEventBus);
    let nuptialService = new NuptialService(mainEventBus, apis.nuptialApi, worldFactory, nuptialMalesContainer);
    let specieBuilderService = new SpecieBuilderService(mainEventBus, apis.specieBuilderApi, specieFactory);
    let userService = new UserService(apis.userApi, notificationsContainer);
    let messageHandlerService = new MessageHandlerService(mainEventBus, serverConnection, worldService, colonyService, specieBuilderService, userService, nuptialService);

    let domainFacade = new DomainFacade(mainEventBus, accountService, messageHandlerService, worldService, colonyService, nuptialService, specieBuilderService, userService);

    return domainFacade;
}

export {
    initDomainLayer
}