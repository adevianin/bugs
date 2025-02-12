class BaseGraphicView {

    static textureManager;
    static popupManager;
    static domainFacade;
    static eventBus;
    static pixiApp;

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

    static usePixiApp(pixiApp) {
        BaseGraphicView.pixiApp = pixiApp;
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

    get $pixiApp() {
        return BaseGraphicView.pixiApp;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseGraphicView
}