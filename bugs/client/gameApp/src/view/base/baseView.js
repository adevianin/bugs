class BaseView {

    static domainFacade;
    static eventBus;
    static messages;
    static pixiApp;
    static messageMaster;

    get $domainFacade() {
        return BaseView.domainFacade;
    }

    get $eventBus() {
        return BaseView.eventBus;
    }

    get $messages() {
        return BaseView.messages;
    }

    get $pixiApp() {
        return BaseView.pixiApp;
    }

    get $mm() {
        return BaseView.messageMaster;
    }

    static useDomainFacade(domainFacade) {
        BaseView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseView.eventBus = eventBus;
    }

    static useMessages(messages) {
        BaseView.messages = messages;
    }

    static usePixiApp(pixiApp) {
        BaseView.pixiApp = pixiApp;
    }

    static useMessageMaster(messageMaster) {
        BaseView.messageMaster = messageMaster;
    }

}

export {
    BaseView
}