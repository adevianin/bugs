class BaseView {

    static domainFacade;
    static eventBus;

    get $domainFacade() {
        return BaseView.domainFacade;
    }

    get $eventBus() {
        return BaseView.eventBus;
    }

    static useDomainFacade(domainFacade) {
        BaseView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseView.eventBus = eventBus;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseView
}   