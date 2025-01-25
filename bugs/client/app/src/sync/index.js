import { Requester } from "@utils/requester"
import { AccountApi } from "./accountApi";
import { ServerConnection } from "./serverConnection";
import { NestApi } from "./nestApi";
import { ColonyApi } from "./colonyApi";
import { AntApi } from "./antApi";
import { UserApi } from "./userApi";
import { NuptialEnvironmentApi } from "./nuptialEnvironmentApi";

function initSyncLayer(initialData) {
    let requester = new Requester();
    let serverConnection = new ServerConnection(initialData.mainSocketURL);

    let accountApi = new AccountApi(requester);
    let nestApi = new NestApi(requester);
    let colonyApi = new ColonyApi(requester);
    let antApi = new AntApi(requester);
    let userApi = new UserApi(requester);
    let nuptialEnvironmentApi = new NuptialEnvironmentApi(requester)

    return {
        apis: {
            accountApi,
            nestApi,
            colonyApi,
            antApi,
            userApi,
            nuptialEnvironmentApi
        },
        serverConnection,
    };
}

export {
    initSyncLayer
}