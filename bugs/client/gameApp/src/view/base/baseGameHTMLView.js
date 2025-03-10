import { BaseHTMLView } from "@common/view/base/baseHTMLView";

class BaseGameHTMLView extends BaseHTMLView {

    static pixiApp;

    get $pixiApp() {
        return BaseGameHTMLView.pixiApp;
    }

    static usePixiApp(pixiApp) {
        BaseGameHTMLView.pixiApp = pixiApp;
    }

}

export {
    BaseGameHTMLView
}