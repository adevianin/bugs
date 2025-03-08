import { BaseGameView } from "./baseGameView";

class BaseGraphicView extends BaseGameView {

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