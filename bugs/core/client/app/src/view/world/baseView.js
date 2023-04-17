class BaseView {

    static textureManager;

    static useTextureManager(textureManager) {
        BaseView.textureManager = textureManager;
    }

    remove(){}

}

export {
    BaseView
}