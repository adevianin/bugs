import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/game/panel/base/intInput/intInputView";
import { PositionView } from "@view/game/panel/base/position/positionView";

class NewNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._queenOfColony = this.$domainFacade.getQueenOfColony(this._performingColony.id);

        this._render();

        this._checkQueenExisting();

        this._nestNameEl.addEventListener('change', this._onNestNameChanged.bind(this));
        this._chooseBuildingSiteBtn.addEventListener('click', this._onChooseBuildingSiteBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    remove() {
        super.remove();
        this._buildingPosition.remove();
        this._workersCount.remove();
        this._warriorsCount.remove();
    }

    _render() {
        this._el.innerHTML = newNestOperationCreatorTmpl;

        this._startBtn = this._el.querySelector('[data-start]');

        let workersCountInput = this._el.querySelector('[data-workers-count-input]');
        let workersCountErrEl = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCount = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrEl);

        let warriorsCountInput = this._el.querySelector('[data-warriors-count-input]');
        let warriorsCountErrEl = this._el.querySelector('[data-warriors-count-err]');
        let minWarriorsCount = CONSTS.BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS.MIN_WARRIORS_COUNT;
        let maxWarriorsCount = CONSTS.BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS.MAX_WARRIORS_COUNT;
        this._warriorsCount = new IntInputView(warriorsCountInput, minWarriorsCount, maxWarriorsCount, warriorsCountErrEl);

        this._nestNameEl = this._el.querySelector('[data-nest-name]');
        this._nestNameErr = this._el.querySelector('[data-nest-name-err]');

        this._buildingPosition = new PositionView(this._el.querySelector('[data-building-position]'));
        this._chooseBuildingSiteBtn = this._el.querySelector('[data-choose-building-position]');
        this._buildingPositionErrEl = this._el.querySelector('[data-building-position-err]');

        this._errorContainerEl = this._el.querySelector('[data-error-container]');
    }

    _validate() {
        let isError = false;

        if (!this._workersCount.validate()) {
            isError = true;
        }

        if (!this._warriorsCount.validate()) {
            isError = true;
        }

        if (!this._validateBuildingPosition()) {
            isError = true;
        }

        if (!this._validateNestName()) {
            isError = true;
        }

        return !isError;
    }

    _validateBuildingPosition() {
        let isSpecified = !!this._buildingPosition.value;
        let errText = isSpecified ? '' : this.$messages.building_position_needed;
        this._renderBuildingPositionError(errText);
        return isSpecified;
    }

    _renderBuildingPositionError(errText) {
        this._buildingPositionErrEl.innerHTML = errText;
    }

    _validateNestName() {
        let nestName = this._nestNameEl.value;

        if (nestName.length < 3) {
            this._renderNestNameErr(this.$messages.to_short_name);
            return false;
        }

        let regex = /^[a-zA-Zа-яА-ЯіїєІЇЄ0-9 ]+$/u;
        if (!regex.test(nestName)) {
            this._renderNestNameErr(this.$messages.use_only_chars_and_digits);
            return false;
        }

        this._renderNestNameErr('');

        return true;
    }

    _renderNestNameErr(errText) {
        this._nestNameErr.innerHTML = errText;
    }

    _checkQueenExisting() {
        if (!this._queenOfColony) {
            this._renderError('CANT_BUILD_SUB_NEST_WITHOUT_QUEEN');
            this._chooseBuildingSiteBtn.disabled = true;
            this._startBtn.disabled = true;
        }
    }

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }

    _showMarkers() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.POINTER, this._buildingPosition.value)];
        this._demonstrateMarkersRequest(markers);
    }

    _onChooseBuildingSiteBtnClick() {
        let pickableCircle = { center: this._queenOfColony.position, radius: CONSTS.MAX_DISTANCE_TO_SUB_NEST };
        this.$eventBus.emit('positionPickRequest', pickableCircle, (point) => { 
            this._buildingPosition.value = point;
            this._validateBuildingPosition();
            this._showMarkers();
        });
    }

    _onStartBtnClick() {
        let isValid = this._validate();
        if (!isValid) {
            return;
        }
        let workersCount = this._workersCount.value;
        let warriorsCount = this._warriorsCount.value;
        let nestName = this._nestNameEl.value;
        this.$domainFacade.buildNewSubNestOperation(this._performingColony.id, this._buildingPosition.value, workersCount, warriorsCount, nestName)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            })
    }

    _onNestNameChanged() {
        this._validateNestName();
    }

}

export { NewNestOperationCreatorView }