import { MainSocketConsumer } from './mainSocketConsumer';

function initSyncLayer(domainFacade) {
    let socket = new WebSocket(`ws://${location.host}/mainsocket`);
    let socketConsumer = new MainSocketConsumer(socket, domainFacade);
}

export {
    initSyncLayer
}