import './operationsTab.css';

import { BaseHTMLView } from "../../../base/baseHTMLView"
import operationTabTmpl from './operationTabTmpl.html';
import { NewNestOperationCreator } from "./operationCreators/newNest/newNestOperationCreator";
import { DestroyNestOperationCreator } from './operationCreators/destroyNest/destroyNestOperationCreator';
import { PillageNestOperationCreator } from './operationCreators/pillageNest/pillageNestOperationCreator';
import { OperationsList } from "./operationsList/operationsList"; 

class OperationsTab extends BaseHTMLView {
    
    constructor(el) {
        super(el);
        this._operationCreator = null;
        this._el.innerHTML =  'операції'
        // this._myColony = this.$domainFacade.findMyColony();

        // this._render();

        // this._addNewNestBtn.addEventListener('click', this._onAddNewNestClick.bind(this));
        // this._destroyNestBtn.addEventListener('click', this._onDestroyNestClick.bind(this));
        // this._pillageNestBtn.addEventListener('click', this._onPillageNestClick.bind(this));
        // this._cancelOperationCreatingBtn.addEventListener('click', this._stopOperationCreating.bind(this));
    }

    toggle(isEnabled) {
        super.toggle(isEnabled);
        this.$eventBus.emit('operationsViewActivationChanged', isEnabled);
    }

    _render() {
        this._el.classList.add('operation-tab');
        this._el.innerHTML = operationTabTmpl;

        this._addNewNestBtn = this._el.querySelector('[data-add-new-nest]');
        this._destroyNestBtn = this._el.querySelector('[data-destroy-nest]');
        this._pillageNestBtn = this._el.querySelector('[data-pillage-nest]');
        this._newOperationListEl = this._el.querySelector('[data-new-operation-list]');
        this._cancelOperationCreatingBtn = this._el.querySelector('[data-cancel-operation-creating]');

        new OperationsList(this._el.querySelector('[data-operations-list]'), this._myColony);

        this._toggleOperationCreating(false);
    }

    _stopOperationCreating() {
        this._operationCreator.remove();
        this._operationCreator = null;
        this._toggleOperationCreating(false);
        this.$eventBus.emit('cancelAnyMarkerPlacerRequest');
    }

    _onAddNewNestClick() {
        this._toggleOperationCreating(true);
        let el = document.createElement('div');
        this._el.querySelector('[data-operation-creator-placeholder]').appendChild(el);
        this._operationCreator = new NewNestOperationCreator(el, this._stopOperationCreating.bind(this));
    }

    _onDestroyNestClick() {
        this._toggleOperationCreating(true);
        let el = document.createElement('div');
        this._el.querySelector('[data-operation-creator-placeholder]').appendChild(el);
        this._operationCreator = new DestroyNestOperationCreator(el, this._stopOperationCreating.bind(this));
    }

    _onPillageNestClick() {
        this._toggleOperationCreating(true);
        let el = document.createElement('div');
        this._el.querySelector('[data-operation-creator-placeholder]').appendChild(el);
        this._operationCreator = new PillageNestOperationCreator(el, this._stopOperationCreating.bind(this));
    }

    _toggleOperationCreating(isCreating) {
        this._newOperationListEl.classList.toggle('hidden', isCreating);
        this._cancelOperationCreatingBtn.classList.toggle('hidden', !isCreating);
    }
}

export {
    OperationsTab
}