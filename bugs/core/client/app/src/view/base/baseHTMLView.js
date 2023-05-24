class BaseHTMLView {

    static domainFacade;

    static useDomainFacade(domainFacade) {
        BaseHTMLView.domainFacade = domainFacade;
    }
}

export {
    BaseHTMLView
}