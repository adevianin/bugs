import { Requester } from "utils/requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";
import { TownApi } from "./townApi";

function initSyncLayer() {
    let requester = new Requester();

    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();

    let townApi = new TownApi(serverConnection);

    return {
        userApi,
        townApi,
        serverConnection
    };
}

export {
    initSyncLayer
}