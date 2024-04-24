import { EventEmitter } from "@utils/eventEmitter";

class BaseHTMLView {

    static domainFacade;
    static eventBus;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseHTMLView.eventBus = eventBus;
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