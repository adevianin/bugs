import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import transportFoodOperationCreatorTmpl from './transportFoodOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { CONSTS } from "@domain/consts";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class TransportFoodOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestFromSelector.events.addListener('changed', this._onNestFromChanged.bind(this));
        this._nestToSelector.events.addListener('changed', this._onNestToChanged.bind(this));
    }

    remove() {
        this._nestFromSelector.remove();
        this._nestToSelector.remove();
        this._workersCountView.remove();
        this._warriorsCountView.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = transportFoodOperationCreatorTmpl;

        this._nestFromSelector = new NestSelectorView(this._el.querySelector('[data-nest-from-selector]'), this._performingColony.id);
        this._nestFromErrorContainer = this._el.querySelector('[data-nest-from-err]');

        this._nestToSelector = new NestSelectorView(this._el.querySelector('[data-nest-to-selector]'), this._performingColony.id);
        this._nestToErrorContainer = this._el.querySelector('[data-nest-to-err]');

        this._selectedNestsErrorContainer = this._el.querySelector('[data-selected-nests-error-container]');

        let workersCountInput = this._el.querySelector('[data-workers-count]');
        let workersCountErrContainer = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCountView = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrContainer);

        let warriorsCountInput = this._el.querySelector('[data-warriors-count]');
        let warriorsCountErrContainer = this._el.querySelector('[data-warriors-count-err]');
        let minWarriorsCount = CONSTS.TRANSPORT_FOOD_OPERATION_REQUIREMENTS.MIN_WARRIORS_COUNT;
        let maxWarriorsCount = CONSTS.TRANSPORT_FOOD_OPERATION_REQUIREMENTS.MAX_WARRIORS_COUNT;
        this._warriorsCountView = new IntInputView(warriorsCountInput, minWarriorsCount, maxWarriorsCount, warriorsCountErrContainer);

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._showMarkers();
    }

    _validate() {
        let isError = false;

        let nestFromError = this._validateNestFrom();
        this._renderNestFromError(nestFromError);
        if (nestFromError) {
            isError = true;
        }

        let nestToError = this._validateNestTo();
        this._renderNestToError(nestToError);
        if (nestToError) {
            isError = true;
        }

        if (!this._workersCountView.validate()) {
            isError = true;
        }

        if (!this._warriorsCountView.validate()) {
            isError = true;
        }

        let selectedNestsError = this._validateSelectedNests();
        this._renderSelectedNestsError(selectedNestsError);
        if (selectedNestsError) {
            isError = true;
        }

        return !isError;
    }

    _validateNestFrom() {
        if (!this._nestFromSelector.nestId) {
            return this.$messages.choose_nest_from;
        }

        return null;
    }

    _renderNestFromError(errorText) {
        this._nestFromErrorContainer.innerHTML = errorText || '';
    }

    _validateNestTo() {
        if (!this._nestToSelector.nestId) {
            return this.$messages.choose_nest_to;
        }

        return null;
    }

    _renderNestToError(errorText) {
        this._nestToErrorContainer.innerHTML = errorText || '';
    }

    _validateSelectedNests() {
        if (!!this._nestFromSelector.nestId && this._nestFromSelector.nestId == this._nestToSelector.nestId) {
            return this.$messages.choose_different_nests;
        }

        return null;
    }

    _renderSelectedNestsError(errorText) {
        this._selectedNestsErrorContainer.innerHTML = errorText;
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return;
        }

        let performingColonyId = this._performingColony.id;
        let fromNestId = this._nestFromSelector.nestId;
        let toNestId = this._nestToSelector.nestId;
        let workersCount = this._workersCountView.value;
        let warriorsCount = this._warriorsCountView.value;
        try {
            await this.$domainFacade.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
            this._onDone();
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError('SOMETHING_WENT_WRONG');
            }
        }
    }

    _onNestFromChanged() {
        this._showMarkers();
        this._validate();
    }

    _onNestToChanged() {
        this._showMarkers();
        this._validate();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestFromSelector.nestId) {
            let nestFrom = this.$domainFacade.findEntityById(this._nestFromSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.UNLOAD, nestFrom.position));
        }

        if (this._nestToSelector.nestId && this._nestToSelector.nestId != this._nestFromSelector.nestId) {
            let nestFrom = this.$domainFacade.findEntityById(this._nestToSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.LOAD, nestFrom.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    TransportFoodOperationCreatorView
}