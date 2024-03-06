import { BaseHTMLView } from "@view/panel/base/baseHTMLView";

class LarvaTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._el.innerHTML = 'larva';
    }

}

export {
    LarvaTabView
}