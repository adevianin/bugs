import { EventEmitter } from "@utils/eventEmitter";

class BaseHTMLView {

    static domainFacade;
    static eventBus;
    static messages;
    static pixiApp;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseHTMLView.eventBus = eventBus;
    }

    static useMessages(messages) {
        BaseHTMLView.messages = messages;
    }

    static usePixiApp(pixiApp) {
        BaseHTMLView.pixiApp = pixiApp;
    }

    constructor(el) {
        this._el = el;
        this.events = new EventEmitter();
    }

    get el() {
        return this._el;
    }

    get $domainFacade() {
        return BaseHTMLView.domainFacade;
    }

    get $eventBus() {
        return BaseHTMLView.eventBus;
    }

    get $messages() {
        return BaseHTMLView.messages;
    }

    get $pixiApp() {
        return BaseHTMLView.pixiApp;
    }

    toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    remove() {
        this._el.remove();
        this.events.removeAllListeners();
    }
}

export {
    BaseHTMLView
}