class BaseHTMLView {

    static domainFacade;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }

    remove() {}
}

export {
    BaseHTMLView
}