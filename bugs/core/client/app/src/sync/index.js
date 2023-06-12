import { Requester } from "utils/requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";
import { NestApi } from "./nestApi";
import { OperationApi } from "./operationApi";

function initSyncLayer() {
    let requester = new Requester();

    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();
    let nestApi = new NestApi(serverConnection);
    let operationApi = new OperationApi(serverConnection);

    return {
        userApi,
        nestApi,
        operationApi,
        serverConnection
    };
}

export {
    initSyncLayer
}