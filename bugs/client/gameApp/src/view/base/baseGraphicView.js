import { BaseView } from "@common/view/base/baseView";

class BaseGraphicView extends BaseView {

    static textureManager;

    static useTextureManager(textureManager) {
        BaseGraphicView.textureManager = textureManager;
    }

    get $textureManager() {
        return BaseGraphicView.textureManager;
    }

}

export {
    BaseGraphicView
}