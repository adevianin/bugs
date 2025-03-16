class BaseView {

    static domain;
    static eventBus;
    static mm;
    static messages;

    get $domain() {
        return BaseView.domain;
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

    static useDomain(domain) {
        BaseView.domain = domain;
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