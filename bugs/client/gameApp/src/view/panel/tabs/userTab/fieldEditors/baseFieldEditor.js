import { BaseHTMLView } from "@common/view/base/baseHTMLView";

class BaseFieldEditor extends BaseHTMLView {
    
    constructor(onDone) {
        super(document.createElement('div'));
        this._onDone = onDone;
    }
}

export {
    BaseFieldEditor
}