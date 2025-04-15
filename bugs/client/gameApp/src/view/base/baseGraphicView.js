import { BaseView } from "@common/view/base/baseView";

class BaseGraphicView extends BaseView {

    static textureManager;
    static stepProgressChecker;

    static useTextureManager(textureManager) {
        BaseGraphicView.textureManager = textureManager;
    }

    static useStepProgressChecker(stepProgressChecker) {
        BaseGraphicView.stepProgressChecker = stepProgressChecker;
    }

    get $textureManager() {
        return BaseGraphicView.textureManager;
    }

    get $stepProgress() {
        return BaseGraphicView.stepProgressChecker;
    }

}

export {
    BaseGraphicView
}