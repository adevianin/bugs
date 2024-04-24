import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationsTabTmpl from './operationsTabTmpl.html';
import { OperationsListView } from "./operationsList";
import { OperationsCreatorView } from "./operationsCreator";

class OperationsTab extends BaseHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    manageColony(colony) {
        this._colony = colony;
        this._operationsCreator.manageColony(colony);
        this._operationsList.manageColony(colony);
    }

    remove() {
        super.remove();
        this._operationsList.remove();
        this._operationsCreator.remove();
    }

    _render() {
        this._el.innerHTML = operationsTabTmpl;

        this._operationsList = new OperationsListView(this._el.querySelector('[data-operations-list]'));
        this._operationsCreator = new OperationsCreatorView(this._el.querySelector('[data-operations-creator]'));
    }
}

export { OperationsTab }