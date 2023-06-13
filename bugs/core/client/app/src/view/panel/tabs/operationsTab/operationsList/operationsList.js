import { BaseHTMLView } from "view/base/baseHTMLView";

class OperationsList extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = 'operations list'
    }

}

export {
    OperationsList
}