import { WorldView } from './worldView';

function initViewLayer(domainFacade) {
    let canvEl = document.getElementById('bugsCanvas');
    let worldView = new WorldView(canvEl, domainFacade);
}

export { initViewLayer }