import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { OperationView } from "./operationView";
import operationsListTmpl from "./operationsListTmpl.html";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class OperationsListView extends BaseGameHTMLView {
    
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
        this._noOperationsPlacehiolder = this._el.querySelector('[data-no-operations-placeholder]');

        this._el.querySelector('[data-col-name-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_NAME);
        this._el.querySelector('[data-col-name-status]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_STATUS);
        this._el.querySelector('[data-col-name-hiring]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_HIRING);
        this._el.querySelector('[data-col-name-actions]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATIONS_LIST_COL_LABEL_ACTIONS);
        this._el.querySelector('[data-no-operations-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATIONS_LIST_NO_OPERATIONS_LABEL);
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
        this._stopListeningAddedOperation = colony.on('operationAdded', this._onOperationAdded.bind(this));
        this._stopListeningOperationDeleted = colony.on('operationRemoved', this._onOperationDeleted.bind(this));
    }

    _onOperationAdded(operation) {
        this._renderOperation(operation);
        this._renderEmptyState();
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
        this._renderEmptyState();
    }

    _stopListenColony() {
        if (this._colony) {
            this._stopListeningAddedOperation();
            this._stopListeningOperationDeleted();
        }
    }

    _renderColonyOperations() {
        this._removeOperationViews();
        this._colony.operations.forEach(operation => {
            this._renderOperation(operation);
        });
        this._renderEmptyState();
    }

    _renderOperation(operation) {
        let el = document.createElement('tr');
        el.classList.add('colony-manager__operation');
        let view = new OperationView(el, operation, this._colony.id);
        view.events.on('activate', () => this._onOperationViewActivateClick(operation));
        view.events.on('stopRequest', () => this._onOperationViewStopRequest(operation));
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
        this.$eventBus.emit('showPointRequest', this._selectedOperation.markers[0].point);
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

    _renderEmptyState() {
        let isEmpty = true;
        for (let operation of this._colony.operations) {
            if (!operation.isMarkedAsStopping()) {
                isEmpty = false;
                break;
            }
        }

        this._noOperationsPlacehiolder.classList.toggle('g-hidden', !isEmpty);
    }

    _onOperationViewActivateClick(operation) {
        if (this._selectedOperationId == operation.id) {
            this._clearOperationSelect();
        } else {
            this._selectOperation(operation);
        }
    }

    _onOperationViewStopRequest(operation) {
        operation.markAsStopping();
        this._operationViews[operation.id].toggle(false);
        this.$domain.stopOperation(this._colony.id, operation.id);
        this._renderEmptyState();
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