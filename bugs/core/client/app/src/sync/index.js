import { Requester } from "utils/requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";
import { TownApi } from "./townApi";
import { OperationApi } from "./operationApi";

function initSyncLayer() {
    let requester = new Requester();

    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();
    let townApi = new TownApi(serverConnection);
    let operationApi = new OperationApi(serverConnection);

    return {
        userApi,
        townApi,
        operationApi,
        serverConnection
    };
}

export {
    initSyncLayer
}