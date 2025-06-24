import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import destroyNestOperationCreatorTmpl from './destroyNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/panel/base/nest/nestInlineView";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { ErrorCodes } from "@domain/enum/errorCodes";

class DestroyNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._mainNest = this.$domain.getMainNestOfMyColony(this._performingColony.id);
        this._nestToDestroyData = null;

        this._render();

        this._checkOperationConditions();

        this._chooseNestBtn.addEventListener('click', this._onChooseNestBtnClick.bind(this));
        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this._workersCount.events.on('change', this._onAntsCountChange.bind(this));
        this._warriorsCount.events.on('change', this._onAntsCountChange.bind(this));
    }

    remove() {
        super.remove();
        this._workersCount.remove();
        this._warriorsCount.remove();
        this._choosedNestView.remove();
        this._loader.remove();
    }

    _render() {
        this._el.innerHTML = destroyNestOperationCreatorTmpl;

        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._startBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_START_BTN_LABEL);

        this._mainErrorContainerEl = this._el.querySelector('[data-main-error-container]');
        this._minAntsCountErrorContainerEl = this._el.querySelector('[data-min-ants-count-error-container]');

        this._chooseNestBtn = this._el.querySelector('[data-choose-nest-btn]');
        this._chooseNestBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_CHOOSE_NEST_BTN_LABEL);
        this._choosedNestErr = this._el.querySelector('[data-choosed-nest-err]');
        this._choosedNestView = new NestInlineView(this._el.querySelector('[data-choosed-nest]'));

        let workersCountInput = this._el.querySelector('[data-workers-count]');
        let workersCountErrEl = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCount = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrEl);

        let warriorsCountInput = this._el.querySelector('[data-warriors-count]');
        let warriorsCountErrEl = this._el.querySelector('[data-warriors-count-err]');
        let minWarriorsCount = CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MIN_WARRIORS_COUNT;
        let maxWarriorsCount = CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MAX_WARRIORS_COUNT;
        this._warriorsCount = new IntInputView(warriorsCountInput, minWarriorsCount, maxWarriorsCount, warriorsCountErrEl);

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._el.querySelector('[data-operation-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_TITLE);
        this._el.querySelector('[data-nest-to-destroy-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.DESTROY_NEST_OP_CR_NEST_TO_DESTROY_LABEL);
        this._el.querySelector('[data-workers-count-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_WORKERS_COUNT);
        this._el.querySelector('[data-warriors-count-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_WARRIORS_COUNT);
    }

    async _validate() {
        let isError = false;

        if (!this._workersCount.validate()) {
            isError = true;
        }

        if (!this._warriorsCount.validate()) {
            isError = true;
        }

        let choosedNestErr = await this._validateChoosedNest();
        this._renderChoosedNestError(choosedNestErr);
        if (choosedNestErr) {
            isError = true;
        }

        let minAntsCountErr = this._validateMinAntsCount();
        this._renderMinAntsCountErr(minAntsCountErr);
        if (minAntsCountErr) {
            isError = true;
        }

        let condErr = await this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    async _validateChoosedNest() {
        let nestId = this._nestToDestroyData ? this._nestToDestroyData.id : null;
        return await this.$domain.validateNestToDestroy(nestId);
    }

    _renderChoosedNestError(errId) {
        this._choosedNestErr.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateMinAntsCount() {
        let antsCount = this._workersCount.value + this._warriorsCount.value;
        if (antsCount < CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MIN_ANTS_COUNT) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_TOO_FEW_ANTS;
        }

        return null;
    }

    _renderMinAntsCountErr(errId) {
        this._minAntsCountErrorContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _validateOperationConditions() {
        return await this.$domain.validateDestroyNestOperationConditions(this._performingColony.id);
    }

    _renderOperationConditionsErr(condErr) {
        this._renderMainError(condErr);
        this._chooseNestBtn.disabled = !!condErr;
        this._startBtn.disabled = !!condErr;
    }

    async _checkOperationConditions() {
        let condErr = await this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
    }

    _onChooseNestBtnClick() {
        this.$eventBus.emit('panelFoldRequest');
        this.$eventBus.emit('raidNestPickRequest', this._performingColony.id, this._mainNest.position, async (nestId) => {
            this.$eventBus.emit('panelUnfoldRequest');
            let nestData = await this.$domain.getEntityDataById(nestId);
            this._choosedNestView.setNestData(nestData);
            this._nestToDestroyData = nestData;
            this._showMarkers();
            let choosedNestErr = await this._validateChoosedNest();
            this._renderChoosedNestError(choosedNestErr);
        });
    }

    _onAntsCountChange() {
        let minAntsCountErr = this._validateMinAntsCount();
        this._renderMinAntsCountErr(minAntsCountErr);
    }

    async _onStartBtnClick() {
        let isValid = await this._validate();
        if (!isValid) {
            return
        }

        this._loader.toggleVisibility(true);

        let result = await this.$domain.destroyNestOperation(this._performingColony.id, this._warriorsCount.value, this._workersCount.value, this._nestToDestroyData.id);
        
        if (result.success) {
            this._waitAddingOperation(result.operationId, () => {
                this._onDone();
            });
        } else {
            this._loader.toggleVisibility(false);
            if (result.errCode == ErrorCodes.CONFLICT) {
                await this._validate();
            } else {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

    async _showMarkers() {
        let marker = await this.$domain.buildMarker(MarkerTypes.CROSS, this._nestToDestroyData.position);
        let markers = [marker];
        this._demonstrateMarkersRequest(markers);
    }

    _renderMainError(errId) {
        this._mainErrorContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }
}

export {
    DestroyNestOperationCreatorView
}