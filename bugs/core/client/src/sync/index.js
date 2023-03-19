// import { MainSocketConsumer } from './mainSocketConsumer';
import { Requester } from "./requester"
import { UserApi } from "./userApi";
import { ServerConnection } from "./serverConnection";

function initSyncLayer() {
    let requester = new Requester();

    let userApi = new UserApi(requester);
    let serverConnection = new ServerConnection();

    return {
        userApi,
        serverConnection
    };
    // let socket = new WebSocket(`ws://${location.host}/mainsocket`);
    // let socketConsumer = new MainSocketConsumer(socket, domainFacade);
}

export {
    initSyncLayer
}