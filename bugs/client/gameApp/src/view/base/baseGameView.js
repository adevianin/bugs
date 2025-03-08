import { BaseView } from "@common/view/base/baseView";

class BaseGameView extends BaseView {

    static messages;
    static pixiApp;

    get $messages() {
        return BaseGameView.messages;
    }

    get $pixiApp() {
        return BaseGameView.pixiApp;
    }

    static useMessages(messages) {
        BaseGameView.messages = messages;
    }

    static usePixiApp(pixiApp) {
        BaseGameView.pixiApp = pixiApp;
    }

}

export {
    BaseGameView
}