import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationTmpl from './operationTmpl.html';

class OperationView extends BaseHTMLView {

    constructor(el, operation, colonyId) {
        super(el);
        this._operation = operation;
        this._colonyId = colonyId;
        
        this._render();

        this._stopBtn.addEventListener('click', this._onStopBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = operationTmpl;
        this._el.querySelector('[data-name]').innerHTML = this._operation.name;
        this._el.querySelector('[data-status]').innerHTML = this._operation.status;
        this._stopBtn = this._el.querySelector('[data-stop-btn]');
    }

    _onStopBtnClick() {
        this.$domainFacade.stopOperation(this._colonyId, this._operation.id);
    }

}

export {
    OperationView
}