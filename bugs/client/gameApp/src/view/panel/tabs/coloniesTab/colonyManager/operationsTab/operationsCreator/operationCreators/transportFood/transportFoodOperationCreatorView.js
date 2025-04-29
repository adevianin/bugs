import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import transportFoodOperationCreatorTmpl from './transportFoodOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { CONSTS } from "@domain/consts";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { ErrorCodes } from "@domain/enum/errorCodes";

class TransportFoodOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this._nestFromSelector.events.on('changed', this._onNestFromChanged.bind(this));
        this._nestToSelector.events.on('changed', this._onNestToChanged.bind(this));
    }

    remove() {
        this._nestFromSelector.remove();
        this._nestToSelector.remove();
        this._workersCountView.remove();
        this._warriorsCountView.remove();
        this._loader.remove();
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

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

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
            return GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_FROM_NEEDED;
        }

        return null;
    }

    _renderNestFromError(errId) {
        this._nestFromErrorContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateNestTo() {
        if (!this._nestToSelector.nestId) {
            return GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_NEST_TO_NEEDED;
        }

        return null;
    }

    _renderNestToError(errId) {
        this._nestToErrorContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateSelectedNests() {
        if (!!this._nestFromSelector.nestId && this._nestFromSelector.nestId == this._nestToSelector.nestId) {
            return GAME_MESSAGE_IDS.TRANSPORT_FOOD_OPER_DIFFERENT_NESTS_NEEDED;
        }

        return null;
    }

    _renderSelectedNestsError(errId) {
        this._selectedNestsErrorContainer.innerHTML = errId ? this.$mm.get(errId) : '';
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

        this._loader.toggle(true);

        let result = await this.$domain.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);

        if (result.success) {
            this._onDone();
        } else {
            if (result.errCode == ErrorCodes.CONFLICT) {
                this._validate();
            } else {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
        this._loader.toggle(false);
    }

    _onNestFromChanged() {
        this._showMarkers();
        let nestFromError = this._validateNestFrom();
        this._renderNestFromError(nestFromError);
        let selectedNestsError = this._validateSelectedNests();
        this._renderSelectedNestsError(selectedNestsError);
    }

    _onNestToChanged() {
        this._showMarkers();
        let nestToError = this._validateNestTo();
        this._renderNestToError(nestToError);
        let selectedNestsError = this._validateSelectedNests();
        this._renderSelectedNestsError(selectedNestsError);
    }

    async _showMarkers() {
        let markers = [];

        if (this._nestFromSelector.nestId) {
            let nestFromData = await this.$domain.getEntityDataById(this._nestFromSelector.nestId);
            let nestFromMarker = await this.$domain.buildMarker(MarkerTypes.UNLOAD, nestFromData.position);
            markers.push(nestFromMarker);
        }

        if (this._nestToSelector.nestId && this._nestToSelector.nestId != this._nestFromSelector.nestId) {
            let nestToData = await this.$domain.getEntityDataById(this._nestToSelector.nestId);
            let nestToMarker = await this.$domain.buildMarker(MarkerTypes.LOAD, nestToData.position);
            markers.push(nestToMarker);
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    TransportFoodOperationCreatorView
}