class BaseHTMLView {

    static domainFacade;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }

    remove() {
        throw 'remove method is abstract';
    }
}

export {
    BaseHTMLView
}