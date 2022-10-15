import { BugsView } from './bugsView';

function initViewLayer(domainFacade) {
    let canvEl = document.getElementById('bugsCanvas');
    let bugsView = new BugsView(canvEl, domainFacade);
}

export { initViewLayer }