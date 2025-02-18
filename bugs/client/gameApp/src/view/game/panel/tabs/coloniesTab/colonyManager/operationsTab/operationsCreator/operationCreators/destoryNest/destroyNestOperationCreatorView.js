import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import destroyNestOperationCreatorTmpl from './destroyNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/game/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/game/panel/base/nest/nestInlineView";

class DestroyNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._chooseNestBtn.addEventListener('click', this._onChooseNestBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
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
        this._requestErrorContainerEl = this._el.querySelector('[data-request-error-container]');
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

        return !isError;
    }

    _validateChoosedNest() {
        if (!this._choosedNestView.value) {
            return this.$messages.choose_nest_for_attack;
        }
        
        return null;
    }

    _renderChoosedNestError(errText) {
        this._choosedNestErr.innerHTML = errText || '';
    }

    _validateMinAntsCount() {
        let antsCount = this._workersCount.value + this._warriorsCount.value;
        if (antsCount < CONSTS.DESTROY_NEST_OPERATION_REQUIREMENTS.MIN_ANTS_COUNT) {
            return this.$messages.too_few_ants_to_attack;
        }

        return null;
    }

    _renderMinAntsCountErr(errText) {
        this._minAntsCountErrorContainerEl.innerHTML = errText || '';
    }

    _onChooseNestBtnClick() {
        let queenOfColony = this.$domainFacade.getQueenOfColony(this._performingColony.id);
        let pickableCircle = { center: queenOfColony.position, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET };
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, pickableCircle, (nest) => {
            this._choosedNestView.value = nest;
            this._showMarkers();
        });
    }

    _onStartBtnClick() {
        if (!this._validate()) {
            return
        }
        this.$domainFacade.destroyNestOperation(this._performingColony.id, this._warriorsCount.value, this._workersCount.value, this._choosedNestView.value)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderRequestError(errId);
            });
    }

    _showMarkers() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.CROSS, this._choosedNestView.value.position)];
        this._demonstrateMarkersRequest(markers);
    }

    _renderRequestError(errId) {
        this._requestErrorContainerEl.innerHTML = this.$messages[errId];
    }
}

export {
    DestroyNestOperationCreatorView
}