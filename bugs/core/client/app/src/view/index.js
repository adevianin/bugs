import { AppView } from './appView';

function initViewLayer(domainFacade) {
    let app = new AppView(document, domainFacade)
}

export { initViewLayer }