import { BaseHTMLView } from "view/base/baseHTMLView";
import operationTmpl from './operationTmpl.html';

class OperationsList extends BaseHTMLView {

    constructor(el, myColony) {
        super(el);
        this._myColony = myColony;

        this._myColony.on('operationsChanged', this._render.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = '';

        this._myColony.operations.forEach(operation => {
            this._renderOperation(operation);
        });
    }

    _renderOperation(operation) {
        let liEl = document.createElement('li');
        liEl.innerHTML = operationTmpl;
        liEl.querySelector('[data-name]').innerHTML = operation.name;
        liEl.querySelector('[data-status]').innerHTML = operation.status;
        liEl.querySelector('[data-stop-btn]').addEventListener('click', () => {
            this._stopOperation(operation);
        });
        this._el.appendChild(liEl);
    }

    _stopOperation(operation) {
        this.$domainFacade.stopMyColonyOperation(operation.id);
    }

}

export {
    OperationsList
}