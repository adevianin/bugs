import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationsTabTmpl from './operationsTabTmpl.html';

class OperationsTab extends BaseHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    _render() {
        this._el.innerHTML = operationsTabTmpl;
    }
}

export { OperationsTab }