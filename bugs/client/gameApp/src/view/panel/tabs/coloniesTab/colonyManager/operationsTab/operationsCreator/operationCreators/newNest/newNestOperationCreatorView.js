import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { PositionView } from "@view/panel/base/position/positionView";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { TextInputView } from "@view/panel/base/textInput/textInputView";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";

class NewNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._mainNest = this.$domain.getMainNestOfColony(this._performingColony.id);

        this._render();

        this._checkOperationConditions();

        this._chooseBuildingSiteBtn.addEventListener('click', this._onChooseBuildingSiteBtnClick.bind(this));
        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
    }

    remove() {
        super.remove();
        this._buildingPosition.remove();
        this._workersCount.remove();
        this._warriorsCount.remove();
        this._loader.remove();
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

        this._nestNameView = new TextInputView(this._el.querySelector('[data-nest-name]'), this._el.querySelector('[data-nest-name-err]'));

        this._buildingPosition = new PositionView(this._el.querySelector('[data-building-position]'));
        this._chooseBuildingSiteBtn = this._el.querySelector('[data-choose-building-position]');
        this._buildingPositionErrEl = this._el.querySelector('[data-building-position-err]');

        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));
    }

    _validate() {
        let isError = false;

        if (!this._workersCount.validate()) {
            isError = true;
        }

        if (!this._warriorsCount.validate()) {
            isError = true;
        }

        let buildingPosErr = this._validateBuildingPosition();
        this._renderBuildingPositionError(buildingPosErr);
        if (buildingPosErr) {
            isError = true;
        }

        if (!this._nestNameView.validate()) {
            isError = true;
        }

        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    _validateBuildingPosition() {
        return this.$domain.validateBuildingSubNestPosition(this._buildingPosition.value);
    }

    _renderBuildingPositionError(errId) {
        this._buildingPositionErrEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateOperationConditions() {
        return this.$domain.validateNewNestOperationConditions(this._performingColony.id);
    }

    _renderOperationConditionsErr(condErr) {
        this._renderMainError(condErr);
        this._chooseBuildingSiteBtn.disabled = !!condErr;
        this._startBtn.disabled = !!condErr;
    }

    _renderMainError(messageId) {
        this._errorContainerEl.innerHTML = messageId ? this.$mm.get(messageId) : '';
    }

    _checkOperationConditions() {
        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
    }

    _showMarkers() {
        let markers = [this.$domain.buildMarker(MarkerTypes.POINTER, this._buildingPosition.value, { area: CONSTS.NEST_AREA })];
        this._demonstrateMarkersRequest(markers);
    }

    _showMainNest() {
        if (this._mainNest) {
            this.$eventBus.emit('showPointRequest', this._mainNest.position);
        }
    }

    _onChooseBuildingSiteBtnClick() {
        this._showMainNest();
        this.$eventBus.emit('newNestPositionPickRequest', this._mainNest.position, (point) => { 
            this._buildingPosition.value = point;
            let err = this._validateBuildingPosition();
            this._renderBuildingPositionError(err);
            this._showMarkers();
        });
    }

    async _onStartBtnClick() {
        let isValid = this._validate();
        if (!isValid) {
            return;
        }
        let workersCount = this._workersCount.value;
        let warriorsCount = this._warriorsCount.value;
        let nestName = this._nestNameView.value;
        try {
            this._loader.toggle(true);
            let operationId = await this.$domain.buildNewSubNestOperation(this._performingColony.id, this._buildingPosition.value, workersCount, warriorsCount, nestName);
            this._performingColony.waitCreatingOperation(operationId, () => {
                this._onDone();
                this._loader.toggle(false);
            });
        } catch (e) {
            this._loader.toggle(false);
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

}

export { NewNestOperationCreatorView }