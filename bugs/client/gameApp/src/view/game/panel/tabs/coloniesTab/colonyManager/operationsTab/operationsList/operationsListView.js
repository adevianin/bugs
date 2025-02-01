import { BaseHTMLView } from "@view/base/baseHTMLView";
import { OperationView } from "./operationView";
import operationsListTmpl from "./operationsListTmpl.html";

class OperationsListView extends BaseHTMLView {
    
    constructor(el) {
        super(el);
        this._operationViews = {};
        this._selectedOperation = null;

        this._render();

        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
        this.$eventBus.on('startOperationCreating', this._onStartOperationCreating.bind(this));
    }

    get _selectedOperationId() {
        return this._selectedOperation ? this._selectedOperation.id : null;
    }

    _render() {
        this._el.innerHTML = operationsListTmpl;

        this._operationsContainerEl = this._el.querySelector('[data-operations-container]');
    }

    manageColony(colony) {
        this._stopListenColony();
        this._colony = colony;
        this._listenColony(colony);

        this._renderColonyOperations();
        this._selectOperation(null);
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
        let el = document.createElement('tr');
        el.classList.add('colony-manager__operation');
        let view = new OperationView(el, operation, this._colony.id);
        view.events.addListener('click', () => this._onOperationViewClick(operation));
        this._operationViews[operation.id] = view;
        this._operationsContainerEl.append(el);
    }

    _removeOperationViews() {
        for (let operationId in this._operationViews) {
            this._operationViews[operationId].remove();
        }
        this._operationViews = {};
    }

    _selectOperation(operation) {
        this._selectedOperation = operation;
        this._renderSelectedOperation();
        this._makeOperationMarkersDemonstratorRequest();
    }

    _renderSelectedOperation() {
        for (let operationId in this._operationViews) {
            let view = this._operationViews[operationId];
            view.toggleSelect(this._selectedOperationId == operationId); 
        }
    }

    _makeOperationMarkersDemonstratorRequest() {
        if (this._selectedOperation) {
            this.$eventBus.emit('operationMarkersShowRequest', this._selectedOperation);
        } else {
            this.$eventBus.emit('operationMarkersHideRequest');
        }
    }

    _onOperationViewClick(operation) {
        if (this._selectedOperationId == operation.id) {
            this._selectOperation(null);
        } else {
            this._selectOperation(operation);
        }
    }

    _onSomeTabSwitched() {
        this._selectOperation(null);
    }

    _onStartOperationCreating() {
        this._selectOperation(null);
    }
}

export {
    OperationsListView
}