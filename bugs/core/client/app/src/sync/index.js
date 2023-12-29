import { Requester } from "@utils/requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";
import { NestApi } from "./nestApi";
import { ColonyApi } from "./colonyApi";
import { AntApi } from "./antApi";

function initSyncLayer() {
    let requester = new Requester();

    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();
    let nestApi = new NestApi(serverConnection);
    let colonyApi = new ColonyApi(serverConnection);
    let antApi = new AntApi(serverConnection);

    return {
        userApi,
        nestApi,
        colonyApi,
        serverConnection,
        antApi
    };
}

export {
    initSyncLayer
}