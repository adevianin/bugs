import { AccountAppView } from "./view/accountAppView";
import { AccountApi } from '@common/sync/accountApi';
import { Requester } from '@common/utils/requester';
import { AccountService } from '@common/domain/service/accountService';
import { DomainFacade } from './domain/domainFacade';
import { EventEmitter } from '@common/utils/eventEmitter';
import { BaseHTMLView } from '@common/view/base/baseHTMLView';
import { msgLibrariesPack } from "./messages/msgLibraries";
import { MessageMaster } from '@common/messages/messageMaster';

MessageMaster.init(msgLibrariesPack);

let requester = new Requester();
let accountApi = new AccountApi(requester);

let accountService = new AccountService(accountApi);
let domainFacade = new DomainFacade(accountService);

let viewEventBus = new EventEmitter();
BaseHTMLView.useDomainFacade(domainFacade);
BaseHTMLView.useEventBus(viewEventBus);

new AccountAppView(document.body, accountApi);