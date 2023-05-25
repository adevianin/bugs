import { Requester } from "utils/requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";
import { TownApi } from "./townApi";

function initSyncLayer() {
    let requester = new Requester();

    let townApi = new TownApi(requester);
    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();

    return {
        userApi,
        townApi,
        serverConnection
    };
}

export {
    initSyncLayer
}