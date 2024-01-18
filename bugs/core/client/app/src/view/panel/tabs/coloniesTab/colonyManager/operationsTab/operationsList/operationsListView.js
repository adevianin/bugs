import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import { OperationView } from "./operationView";

class OperationsListView extends BaseHTMLView {
    
    constructor(el) {
        super(el);
        this._operationViews = {};
    }

    manageColony(colony) {
        if (this._colony) {
            this._stopListenColony();
        }

        this._colony = colony;
        this._listenColony(colony);

        this._renderColonyOperations();
    }

    _listenColony(colony) {
        this._stopListeningOperationsChanges = colony.on('operationsChanged', this._renderColonyOperations.bind(this));
    }

    _stopListenColony() {
        this._stopListeningOperationsChanges();
    }

    _renderColonyOperations() {
        this._removeOperationViews();
        this._colony.operations.forEach(operation => {
            let el = document.createElement('li');
            let view = new OperationView(el, operation, this._colony.id);
            this._operationViews[operation.id] = view;
            this._el.append(el);
        });
    }

    _removeOperationViews() {
        for (let operationId in this._operationViews) {
            this._operationViews[operationId].remove();
        }
        this._operationViews = {};
    }
}

export {
    OperationsListView
}