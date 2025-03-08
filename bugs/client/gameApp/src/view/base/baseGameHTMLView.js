import { BaseHTMLView } from "@common/view/base/baseHTMLView";

class BaseGameHTMLView extends BaseHTMLView {

    static messages;
    static pixiApp;

    get $messages() {
        return BaseGameHTMLView.messages;
    }

    get $pixiApp() {
        return BaseGameHTMLView.pixiApp;
    }

    static useMessages(messages) {
        BaseGameHTMLView.messages = messages;
    }

    static usePixiApp(pixiApp) {
        BaseGameHTMLView.pixiApp = pixiApp;
    }

}

export {
    BaseGameHTMLView
}