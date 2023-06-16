class BaseGraphicView {

    static textureManager;
    static popupManager;
    static domainFacade;

    static useTextureManager(textureManager) {
        BaseGraphicView.textureManager = textureManager;
    }

    static usePopupManager(popupManager) {
        BaseGraphicView.popupManager = popupManager;
    }

    static useDomainFacade(domainFacade) {
        BaseGraphicView.domainFacade = domainFacade;
    }

    get $domainFacade() {
        return BaseGraphicView.domainFacade;
    }

    get $textureManager() {
        return BaseGraphicView.textureManager;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseGraphicView
}