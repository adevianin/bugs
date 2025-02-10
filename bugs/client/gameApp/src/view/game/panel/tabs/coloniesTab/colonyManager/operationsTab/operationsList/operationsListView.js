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
        this.$eventBus.on('beforeStartOperationCreating', this._onStartOperationCreating.bind(this));
        this.$eventBus.on('stopOperationCreating', this._onStopOperationCreating.bind(this));
    }

    get _selectedOperationId() {
        return this._selectedOperation ? this._selectedOperation.id : null;
    }

    get _isOperationSelected() {
        return !!this._selectedOperation;
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
        this._clearOperationSelect();
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
        if (this._selectedOperationId == operationId) {
            this._clearOperationSelect();
        }
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
        this.$eventBus.emit('showMarkersRequest', this._selectedOperation.markers);
    }

    _clearOperationSelect() {
        if (this._isOperationSelected) {
            this._selectedOperation = null;
            this._renderSelectedOperation();
            this.$eventBus.emit('hideMarkersRequest');
        }
    }

    _renderSelectedOperation() {
        for (let operationId in this._operationViews) {
            let view = this._operationViews[operationId];
            view.toggleSelect(this._selectedOperationId == operationId); 
        }
    }

    _onOperationViewClick(operation) {
        if (this._selectedOperationId == operation.id) {
            this._clearOperationSelect();
        } else {
            this._selectOperation(operation);
        }
    }

    _onSomeTabSwitched() {
        this._clearOperationSelect();
    }

    _onStartOperationCreating() {
        this._clearOperationSelect();
        this.toggle(false);
    }

    _onStopOperationCreating() {
        this.toggle(true);
    }
}

export {
    OperationsListView
}