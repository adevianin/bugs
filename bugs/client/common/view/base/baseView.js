class BaseView {

    static domainFacade;
    static eventBus;
    static mm;
    static messages;

    get $domainFacade() {
        return BaseView.domainFacade;
    }

    get $eventBus() {
        return BaseView.eventBus;
    }

    get $mm() {
        return BaseView.mm;
    }

    get $messages() {
        return BaseView.messages;
    }

    static useDomainFacade(domainFacade) {
        BaseView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseView.eventBus = eventBus;
    }

    static useMessageMaster(mm) {
        BaseView.mm = mm;
    }

    static useMessages(messages) {
        BaseView.messages = messages;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseView
}   