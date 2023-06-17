class BaseGraphicView {

    static textureManager;
    static popupManager;
    static domainFacade;
    static eventBus;

    static useTextureManager(textureManager) {
        BaseGraphicView.textureManager = textureManager;
    }

    static usePopupManager(popupManager) {
        BaseGraphicView.popupManager = popupManager;
    }

    static useDomainFacade(domainFacade) {
        BaseGraphicView.domainFacade = domainFacade;
    }

    static useEventBus(eventBus) {
        BaseGraphicView.eventBus = eventBus;
    }

    get $domainFacade() {
        return BaseGraphicView.domainFacade;
    }

    get $textureManager() {
        return BaseGraphicView.textureManager;
    }

    get $eventBus() {
        return BaseGraphicView.eventBus;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseGraphicView
}