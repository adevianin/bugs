import { BaseHTMLView } from "@view/base/baseHTMLView";
import { OperationView } from "./operationView";

class OperationsListView extends BaseHTMLView {
    
    constructor(el) {
        super(el);
        this._operationViews = {};
    }

    manageColony(colony) {
        this._stopListenColony();
        this._colony = colony;
        this._listenColony(colony);

        this._renderColonyOperations();
    }

    remove() {
        super.remove();
        this._stopListenColony();
        this._removeOperationViews();
    }

    _listenColony(colony) {
        this._stopListeningAddedOperation = colony.on('addedOperation', this._onOperationAdded.bind(this));
        this._stopListeningOperationChanged = colony.on('operationChanged', this._onOperationChanged.bind(this));
        this._stopListeningOperationDeleted = colony.on('operationDeleted', this._onOperationDeleted.bind(this));
    }

    _onOperationAdded(operation) {
        this._renderOperation(operation);
    }

    _onOperationChanged(operation) {
        this._operationViews[operation.id].update();
    }

    _onOperationDeleted(operationId) {
        this._operationViews[operationId].remove();
        delete this._operationViews[operationId];
    }

    _stopListenColony() {
        if (this._colony) {
            this._stopListeningAddedOperation();
            this._stopListeningOperationChanged();
            this._stopListeningOperationDeleted();
        }
    }

    _renderColonyOperations() {
        this._removeOperationViews();
        this._colony.operations.forEach(operation => {
            this._renderOperation(operation);
        });
    }

    _renderOperation(operation) {
        let el = document.createElement('li');
        let view = new OperationView(el, operation, this._colony.id);
        this._operationViews[operation.id] = view;
        this._el.append(el);
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