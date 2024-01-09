import { Requester } from "@utils/requester"
import { AccountApi } from "./accountApi";
import { ServerConnection } from "./serverConnection";
import { NestApi } from "./nestApi";
import { ColonyApi } from "./colonyApi";
import { AntApi } from "./antApi";
import { NuptialApi } from "./nuptialApi";

function initSyncLayer() {
    let requester = new Requester();
    let serverConnection = new ServerConnection();

    let accountApi = new AccountApi(requester);
    let nestApi = new NestApi(requester);
    let colonyApi = new ColonyApi(requester);
    let antApi = new AntApi(requester);
    let nuptialApi = new NuptialApi(requester);

    return {
        accountApi,
        nestApi,
        colonyApi,
        serverConnection,
        antApi,
        nuptialApi
    };
}

export {
    initSyncLayer
}