class BaseView {

    static textureManager;
    static popupManager;

    static useTextureManager(textureManager) {
        BaseView.textureManager = textureManager;
    }

    static usePopupManager(popupManager) {
        BaseView.popupManager = popupManager;
    }

    remove(){}

}

export {
    BaseView
}