class BaseHTMLView {

    static domainFacade;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }

    constructor(el) {
        this._el = el;
    }

    get el() {
        return this._el;
    }

    toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    remove() {
        this._el.remove();
    }
}

export {
    BaseHTMLView
}