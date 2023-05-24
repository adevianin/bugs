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

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseGraphicView
}