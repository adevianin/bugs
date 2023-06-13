import { BaseHTMLView } from "../../../base/baseHTMLView"
import operationTabTmpl from './operationTabTmpl.html';
import { NewNestOperationCreator } from "./operationCreators/newNest/newNestOperationCreator";

class OperationsTab extends BaseHTMLView {
    
    constructor(el) {
        super(el);
        this._operationCreator = null;

        this._render();

        this._addNewNestBtn.addEventListener('click', this._onAddNewNestClick.bind(this));
        this._cancelOperationCreatingBtn.addEventListener('click', this._stopOperationCreating.bind(this));
    }

    _render() {
        this._el.innerHTML = operationTabTmpl;

        this._addNewNestBtn = this._el.querySelector('[data-add-new-nest]');
        this._operationsListEl = this._el.querySelector('[data-operations-list]');
        this._cancelOperationCreatingBtn = this._el.querySelector('[data-cancel-operation-creating]');

        this._toggleOperationCreating(false);
    }

    _stopOperationCreating() {
        this._operationCreator.remove();
        this._operationCreator = null;
        this._toggleOperationCreating(false);
    }

    _onAddNewNestClick() {
        this._toggleOperationCreating(true);
        let el = document.createElement('div');
        this._el.querySelector('[data-operation-creator-placeholder]').appendChild(el);
        this._operationCreator = new NewNestOperationCreator(el, this._stopOperationCreating.bind(this));
    }

    _toggleOperationCreating(isCreating) {
        this._operationsListEl.classList.toggle('hidden', isCreating);
        this._cancelOperationCreatingBtn.classList.toggle('hidden', !isCreating);
    }
}

export {
    OperationsTab
}