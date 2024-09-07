import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationsCreatorTmpl from './operationsCreatorTmpl.html';
import { NewNestOperationCreatorView, DestroyNestOperationCreatorView, PillageNestOperationCreatorView, 
    TransportFoodOperationCreatorView, BuildFortificationOperationCreatorView } from "./operationCreators";

class OperationsCreatorView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._cancelOperationCreatingBtn.addEventListener('click', this._stopOperationCreating.bind(this));
        this._newNestOperationBtn.addEventListener('click', this._onNewNestOperationBtnClick.bind(this));
        this._destroyNestOperationBtn.addEventListener('click', this._onDestroyOperationBtnClick.bind(this));
        this._pillageNestOperationBtn.addEventListener('click', this._onPillageNestOperationBtnClick.bind(this));
        this._transportFoodOperationBtn.addEventListener('click', this._onTransportFoodOperationBtnClick.bind(this));
        this._buildFortificationOperationBtn.addEventListener('click', this._onBuildFortificationOperationBtnClick.bind(this));
    }

    manageColony(colony) {
        this._colony = colony;
    }

    remove() {
        super.remove();
        if (this._operationCreator) {
            this._operationCreator.remove();
        }
    }

    _render() {
        this._el.innerHTML = operationsCreatorTmpl;
        this._newNestOperationBtn = this._el.querySelector('[data-add-new-nest]');
        this._destroyNestOperationBtn = this._el.querySelector('[data-destroy-nest]');
        this._pillageNestOperationBtn = this._el.querySelector('[data-pillage-nest]');
        this._transportFoodOperationBtn = this._el.querySelector('[data-transport-food]');
        this._buildFortificationOperationBtn = this._el.querySelector('[data-build-fortification]');
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
        this._operationCreator = new NewNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }

    _onDestroyOperationBtnClick() {
        this._toggleCreatorMode(true);
        this._operationCreator = new DestroyNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }

    _onPillageNestOperationBtnClick() {
        this._toggleCreatorMode(true);
        this._operationCreator = new PillageNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }

    _onTransportFoodOperationBtnClick() {
        this._toggleCreatorMode(true);
        this._operationCreator = new TransportFoodOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }

    _onBuildFortificationOperationBtnClick() {
        this._toggleCreatorMode(true);
        this._operationCreator = new BuildFortificationOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }
}

export { OperationsCreatorView }