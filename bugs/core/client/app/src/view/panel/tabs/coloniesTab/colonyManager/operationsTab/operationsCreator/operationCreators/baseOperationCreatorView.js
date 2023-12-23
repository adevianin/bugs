import { BaseHTMLView } from "@view/base/baseHTMLView";

class BaseOperationCreatorView extends BaseHTMLView {

    constructor(onDone) {
        let el = document.createElement('div');
        super(el);
        this._onDone = onDone;
    }
}

export {
    BaseOperationCreatorView
}