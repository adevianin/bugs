class BaseView {

    static textureManager;
    static popupManager;
    static domainFacade;

    static useTextureManager(textureManager) {
        BaseView.textureManager = textureManager;
    }

    static usePopupManager(popupManager) {
        BaseView.popupManager = popupManager;
    }

    static useDomainFacade(domainFacade) {
        BaseView.domainFacade = domainFacade;
    }

    remove(){
        throw 'remove method is abstract';
    }

}

export {
    BaseView
}