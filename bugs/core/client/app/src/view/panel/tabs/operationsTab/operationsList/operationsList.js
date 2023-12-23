import { BaseHTMLView } from "@view/base/baseHTMLView";
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

    

    _stopOperation(operation) {
        this.$domainFacade.stopMyColonyOperation(operation.id);
    }

}

export {
    OperationsList
}