import { ResetPasswordAppView } from "./view/resetPasswordAppView";
import { AccountApi } from '@common/sync/accountApi';
import { Requester } from '@common/utils/requester';
import { AccountService } from '@common/domain/service/accountService';
import { resetPasswordMsgLibrariesPack } from "./messages/msgLibraries";
import { MessageMaster } from '@common/messages/messageMaster';
import { BaseView } from "@common/view/base/baseView";

let mm = MessageMaster.init(resetPasswordMsgLibrariesPack);
let requester = new Requester();
let accountApi = new AccountApi(requester);
let accountService = new AccountService(accountApi);
BaseView.useMessageMaster(mm);
BaseView.useDomain(accountService);

new ResetPasswordAppView(document.body);