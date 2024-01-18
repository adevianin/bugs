import { BaseHTMLView } from "@view/panel/base/baseHTMLView";

class BaseOperationCreatorView extends BaseHTMLView {

    constructor(performingColony, onDone) {
        let el = document.createElement('div');
        super(el);
        this._performingColony = performingColony;
        this._onDone = onDone;
    }
}

export {
    BaseOperationCreatorView
}