import { BaseHTMLView } from "view/base/baseHTMLView";

class OperationsList extends BaseHTMLView {

    constructor(el, myColony) {
        super(el);
        this._myColony = myColony;

        this._myColony.on('operationsChanged', this._render.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = JSON.stringify(this._myColony.operations);
    }

}

export {
    OperationsList
}