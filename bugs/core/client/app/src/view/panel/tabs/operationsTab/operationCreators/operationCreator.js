import { BaseHTMLView } from "@view/base/baseHTMLView";

class OperationCreator extends BaseHTMLView {

    constructor(el, onDone) {
        super(el);
        this._onDone = onDone;
    }
}

export {
    OperationCreator
}