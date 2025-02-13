import { BaseView } from "./baseView";

class BaseGraphicView extends BaseView {

    static textureManager;

    static useTextureManager(textureManager) {
        BaseGraphicView.textureManager = textureManager;
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