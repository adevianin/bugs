import { Requester } from "@utils/requester"
import { AccountApi } from "./accountApi";
import { ServerConnection } from "./serverConnection";
import { NestApi } from "./nestApi";
import { ColonyApi } from "./colonyApi";
import { AntApi } from "./antApi";

function initSyncLayer() {
    let requester = new Requester();

    let accountApi = new AccountApi(requester);
    let serverConnection = new ServerConnection();
    let nestApi = new NestApi(serverConnection);
    let colonyApi = new ColonyApi(serverConnection);
    let antApi = new AntApi(serverConnection);

    return {
        accountApi,
        nestApi,
        colonyApi,
        serverConnection,
        antApi
    };
}

export {
    initSyncLayer
}