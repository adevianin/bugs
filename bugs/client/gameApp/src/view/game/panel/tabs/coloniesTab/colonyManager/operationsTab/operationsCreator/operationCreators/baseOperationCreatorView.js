import "./style.css";
import { BaseHTMLView } from "@view/base/baseHTMLView";

class BaseOperationCreatorView extends BaseHTMLView {

    constructor(performingColony, onDone) {
        let el = document.createElement('div');
        super(el);
        this._performingColony = performingColony;
        this._onDone = onDone;
    }

    _demonstrateMarkersRequest(markers) {
        this.$eventBus.emit('showMarkersRequest', markers);
    }

}

export {
    BaseOperationCreatorView
}