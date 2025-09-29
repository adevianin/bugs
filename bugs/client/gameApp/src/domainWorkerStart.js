import { Requester } from "@common/utils/requester";
import { AccountApi } from "@common/sync/accountApi";
import { ServerConnection } from "./sync/serverConnection";
import { CommandMessenger } from "./sync/commandMessenger";

import { AccountService } from '@common/domain/service/accountService';
import { WorldMessageHandlerService } from "@domain/service/worldMessageHandlerService";
import { EventEmitter } from '@common/utils/eventEmitter';
import { WorldFactory } from "@domain/worldFactory";
import { WorldService } from "@domain/service/worldService";
import { ColonyService } from "@domain/service/colonyService";
import { UserService } from "@domain/service/userService";
import { NuptialEnvironmentService } from "@domain/service/nuptialEnvironmentService";
import { NestService } from "@domain/service/nestService";
import { AntService } from "@domain/service/antService";

import { NuptialEnvironment } from "@domain/entity/nuptialEnvironment";

import { EntitySerializer } from "./domain/worker/serializers/entitySerializer";
import { ColonySerializer } from "@domain/worker/serializers/colonySerializer";

import { MyStateCollector } from "@domain/worker/myStateCollector";
import { WorldStepEventsCollector } from "@domain/worker/worldStepEventsCollector";
import { ViewPointManager } from "@domain/worker/viewPointManager";
import { DomainWorker } from "./domain/worker/domainWorker";

let requester = new Requester();
let serverConnection = new ServerConnection();
let accountApi = new AccountApi(requester);
let commandMessenger = new CommandMessenger(serverConnection);

let eventBus = new EventEmitter();
let worldFactory = new WorldFactory(eventBus);
let world = worldFactory.buildWorld();
let nuptialEnv = NuptialEnvironment.build();
let worldService = new WorldService(world, worldFactory, eventBus);
let accountService = new AccountService(accountApi);
let colonyService = new ColonyService(eventBus, world, commandMessenger, worldFactory);
let userService = new UserService(eventBus, world, serverConnection);
let nuptialEnvironmentService = new NuptialEnvironmentService(eventBus, world, nuptialEnv, commandMessenger);
let nestService = new NestService(eventBus, world, commandMessenger);
let antService = new AntService(eventBus, world, commandMessenger);
let worldMessageHandlerService = new WorldMessageHandlerService(eventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService, accountService);

let entitySerializer = new EntitySerializer();
let colonySerializer = new ColonySerializer();

let viewPointManager = new ViewPointManager();
let myStateCollector = new MyStateCollector(eventBus, world, nuptialEnv, userService, entitySerializer, colonySerializer);
let worldStepEventsCollector = new WorldStepEventsCollector(eventBus);
new DomainWorker(eventBus, entitySerializer, viewPointManager, requester, myStateCollector, worldStepEventsCollector, {
    worldService,
    accountService,
    colonyService,
    userService,
    nuptialEnvironmentService,
    nestService,
    antService,
    worldMessageHandlerService
});