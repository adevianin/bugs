import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationsCreatorTmpl from './operationsCreatorTmpl.html';
import { NewNestOperationCreator } from "./operationCreators";

class OperationsCreatorView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._cancelOperationCreatingBtn.addEventListener('click', this._stopOperationCreating.bind(this));
        this._newNestOperationBtn.addEventListener('click', this._onNewNestOperationBtnClick.bind(this));
    }

    manageColony(colony) {
        this._colony = colony;
    }

    _render() {
        this._el.innerHTML = operationsCreatorTmpl;
        this._newNestOperationBtn = this._el.querySelector('[data-add-new-nest]');
        this._newOperationsBtnsListEl = this._el.querySelector('[data-new-operation-list]');
        this._cancelOperationCreatingBtn = this._el.querySelector('[data-cancel-operation-creating]');
        this._operationCreatorPlaceholderEl = this._el.querySelector('[data-operation-creator-placeholder]');
        this._toggleCreatorMode(false);
    }

    _toggleCreatorMode(isCreatorMode) {
        this._newOperationsBtnsListEl.classList.toggle('hidden', isCreatorMode);
        this._cancelOperationCreatingBtn.classList.toggle('hidden', !isCreatorMode);
        this._operationCreatorPlaceholderEl.classList.toggle('hidden', !isCreatorMode);
    }

    _stopOperationCreating() {
        this._operationCreator.remove();
        this._operationCreator = null;
        this._toggleCreatorMode(false);
        this.$eventBus.emit('cancelAnyMarkerPlacerRequest');
    }

    _onNewNestOperationBtnClick() {
        this._toggleCreatorMode(true);
        this._operationCreator = new NewNestOperationCreator(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);

    }
}

export { OperationsCreatorView }