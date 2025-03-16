import { AccountAppView } from "./view/accountAppView";
import { AccountApi } from '@common/sync/accountApi';
import { Requester } from '@common/utils/requester';
import { AccountService } from '@common/domain/service/accountService';
import { accountMsgLibrariesPack } from "./messages/msgLibraries";
import { MessageMaster } from '@common/messages/messageMaster';
import { BaseView } from "@common/view/base/baseView";

let mm = MessageMaster.init(accountMsgLibrariesPack);
let requester = new Requester();
let accountApi = new AccountApi(requester);
let accountService = new AccountService(accountApi);

BaseView.useMessageMaster(mm);
BaseView.useDomain(accountService);

new AccountAppView(document.body);