import { BaseHTMLView } from "@view/base/baseHTMLView";
import operationsCreatorTmpl from './operationsCreatorTmpl.html';
import { NewNestOperationCreatorView, DestroyNestOperationCreatorView, PillageNestOperationCreatorView, 
    TransportFoodOperationCreatorView, BuildFortificationOperationCreatorView, BringBugOperationCreatorView } from "./operationCreators";
import { OperationTypes } from "@domain/enum/operationTypes";

class OperationsCreatorView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._cancelOperationCreatingBtn.addEventListener('click', this._stopOperationCreating.bind(this));
        this._newNestOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.BUILD_NEW_SUB_NEST));
        this._destroyNestOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.DESTROY_NEST));
        this._pillageNestOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.PILLAGE_NEST));
        this._transportFoodOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.TRANSPORT_FOOD));
        this._buildFortificationOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.BUILD_FORTIFICATION));
        this._bringBugOperationBtn.addEventListener('click', () => this._startOperationCreating(OperationTypes.BRING_BUG_CORPSE_TO_NEST));
        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
    }

    manageColony(colony) {
        this._colony = colony;
        this._stopOperationCreating();
    }

    _render() {
        this._el.innerHTML = operationsCreatorTmpl;
        this._newNestOperationBtn = this._el.querySelector('[data-add-new-nest]');
        this._destroyNestOperationBtn = this._el.querySelector('[data-destroy-nest]');
        this._pillageNestOperationBtn = this._el.querySelector('[data-pillage-nest]');
        this._transportFoodOperationBtn = this._el.querySelector('[data-transport-food]');
        this._buildFortificationOperationBtn = this._el.querySelector('[data-build-fortification]');
        this._bringBugOperationBtn = this._el.querySelector('[data-bring-bug]');
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
        if (!this._operationCreator) {
            return
        }
        this._operationCreator.remove();
        this._operationCreator = null;
        this._toggleCreatorMode(false);
        this.$eventBus.emit('deactivateMapPickerRequest');
        this.$eventBus.emit('hideMarkersRequest');
        this.$eventBus.emit('stopOperationCreating');
    }

    _startOperationCreating(operationType) {
        this.$eventBus.emit('beforeStartOperationCreating');
        this._toggleCreatorMode(true);
        this._operationCreator = this._buildOperationCreator(operationType);
        this._operationCreatorPlaceholderEl.append(this._operationCreator.el);
    }

    _buildOperationCreator(operationType) {
        switch(operationType) {
            case OperationTypes.BRING_BUG_CORPSE_TO_NEST:
                return new BringBugOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
            case OperationTypes.BUILD_FORTIFICATION:
                return new BuildFortificationOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
            case OperationTypes.BUILD_NEW_SUB_NEST:
                return new NewNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
            case OperationTypes.DESTROY_NEST:
                return new DestroyNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
            case OperationTypes.PILLAGE_NEST:
                return new PillageNestOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
            case OperationTypes.TRANSPORT_FOOD:
                return new TransportFoodOperationCreatorView(this._colony, this._stopOperationCreating.bind(this));
        }
    }

    _onSomeTabSwitched() {
        this._stopOperationCreating();
    }
}

export { OperationsCreatorView }