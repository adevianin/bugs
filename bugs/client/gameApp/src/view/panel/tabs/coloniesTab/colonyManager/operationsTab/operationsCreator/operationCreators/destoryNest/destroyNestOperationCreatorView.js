import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import destroyNestOperationCreatorTmpl from './destroyNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/panel/base/nest/nestInlineView";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";

class DestroyNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._mainNest = this.$domain.getMainNestOfColony(this._performingColony.id);
        this._nestToDestroy = null;

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
    }

    _render() {
        this._el.innerHTML = destroyNestOperationCreatorTmpl;

        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._mainErrorContainerEl = this._el.querySelector('[data-main-error-container]');
        this._minAntsCountErrorContainerEl = this._el.querySelector('[data-min-ants-count-error-container]');

        this._chooseNestBtn = this._el.querySelector('[data-choose-nest-btn]');
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
    }

    _validate() {
        let isError = false;

        if (!this._workersCount.validate()) {
            isError = true;
        }

        if (!this._warriorsCount.validate()) {
            isError = true;
        }

        let choosedNestErr = this._validateChoosedNest();
        this._renderChoosedNestError(choosedNestErr);
        if (choosedNestErr) {
            isError = true;
        }

        let minAntsCountErr = this._validateMinAntsCount();
        this._renderMinAntsCountErr(minAntsCountErr);
        if (minAntsCountErr) {
            isError = true;
        }

        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    _validateChoosedNest() {
        if (!this._nestToDestroy) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NEST_NEEDED;
        }

        if (this._nestToDestroy.isDied) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED;
        }
        
        return null;
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

    _validateOperationConditions() {
        return this.$domain.validateDestroyNestOperationConditions(this._performingColony.id);
    }

    _renderOperationConditionsErr(condErr) {
        this._renderMainError(condErr);
        this._chooseNestBtn.disabled = !!condErr;
        this._startBtn.disabled = !!condErr;
    }

    _checkOperationConditions() {
        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
    }

    _onChooseNestBtnClick() {
        this.$eventBus.emit('raidNestPickRequest', this._performingColony.id, this._mainNest.position, (nest) => {
            this._choosedNestView.value = nest;
            this._nestToDestroy = nest;
            this._showMarkers();
            let choosedNestErr = this._validateChoosedNest();
            this._renderChoosedNestError(choosedNestErr);
        });
    }

    _onAntsCountChange() {
        let minAntsCountErr = this._validateMinAntsCount();
        this._renderMinAntsCountErr(minAntsCountErr);
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return
        }
        try {
            await this.$domain.destroyNestOperation(this._performingColony.id, this._warriorsCount.value, this._workersCount.value, this._nestToDestroy);
            this._onDone();
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

    _showMarkers() {
        let markers = [this.$domain.buildMarker(MarkerTypes.CROSS, this._nestToDestroy.position)];
        this._demonstrateMarkersRequest(markers);
    }

    _renderMainError(errId) {
        this._mainErrorContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }
}

export {
    DestroyNestOperationCreatorView
}