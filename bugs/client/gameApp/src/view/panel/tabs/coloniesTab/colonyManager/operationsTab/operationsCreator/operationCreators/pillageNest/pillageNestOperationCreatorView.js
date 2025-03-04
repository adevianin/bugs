import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/panel/base/nest/nestInlineView";
import { StateSyncRequestError } from "@domain/errors/stateSyncRequestError";
import { GenericRequestError } from "@domain/errors/genericRequestError";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._nestForLoot = null;
        this._queenOfColony = this.$domainFacade.getQueenOfColony(this._performingColony.id);

        this._render();

        this._checkQueenExisting();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestForLootSelector.events.addListener('changed', this._onNestForLootChanged.bind(this));
    }

    remove() {
        this._nestToPillageView.remove();
        this._nestForLootSelector.remove();
        this._warriorsCountView.remove();
        this._workersCountView.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._chooseNestToPillageBtn = this._el.querySelector('[data-choose-nest-to-pillage]');
        this._nestToPillageView = new NestInlineView(this._el.querySelector('[data-nest-to-pillage]'));
        this._nestToPillageErrorContainer = this._el.querySelector('[data-nest-to-pillage-err]');

        this._nestForLootErrContainer = this._el.querySelector('[data-nest-for-loot-err]');
        this._nestForLootSelector = new NestSelectorView(this._el.querySelector('[data-nest-selector]'), this._performingColony.id)

        let warriorsCountInput = this._el.querySelector('[data-warriors-count]');
        let warriorsCountErrContainer = this._el.querySelector('[data-warriors-count-err]');
        let minWarriorsCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MIN_WARRIORS_COUNT;
        let maxWarriorsCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MAX_WARRIORS_COUNT;
        this._warriorsCountView = new IntInputView(warriorsCountInput, minWarriorsCount, maxWarriorsCount, warriorsCountErrContainer);

        let workersCountInput = this._el.querySelector('[data-workers-count]');
        let workersCountErrContainer = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCountView = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrContainer);

        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._showMarkers();
    }

    _checkQueenExisting() {
        if (!this._queenOfColony) {
            this._renderMainError('CANT_PILLAGE_NEST_WITHOUT_LIVING_QUEEN');
            this._chooseNestToPillageBtn.disabled = true;
            this._startBtn.disabled = true;
        }
    }

    _onNestForLootChanged() {
        let nestForLootError = this._validateChoosedNestForLoot();
        this._renderNestForLootError(nestForLootError);
        this._showMarkers();
    }

    _onChooseNestToPillageBtnClick() {
        let pickableCircle = { center: this._queenOfColony.position, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET };
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, pickableCircle, this._onNestToPillageChoosed.bind(this));
    }

    _onNestToPillageChoosed(nestToPillage) {
        this._nestToPillageView.value = nestToPillage;
        this._showMarkers();
        let nestToPillageError = this._validateChoosedNestToPillage();
        this._renderNestToPillageError(nestToPillageError);
    }

    _validate() {
        let isError = false;

        let nestToPillageError = this._validateChoosedNestToPillage();
        this._renderNestToPillageError(nestToPillageError);
        if (nestToPillageError) {
            isError = true;
        }

        let nestForLootError = this._validateChoosedNestForLoot();
        this._renderNestForLootError(nestForLootError);
        if (nestForLootError) {
            isError = true;
        }

        if (!this._warriorsCountView.validate()) {
            isError = true;
        }

        if (!this._workersCountView.validate()) {
            isError = true;
        }

        let condErr = this.$domainFacade.validatePillageNestOperationConditions(this._performingColony.id);
        this._renderMainError(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    _validateChoosedNestToPillage() {
        if (!this._nestToPillageView.value) {
            return this.$messages.choose_nest_for_pillage;
        }

        return null;
    }

    _renderNestToPillageError(errText) {
        this._nestToPillageErrorContainer.innerHTML = errText || '';
    }

    _validateChoosedNestForLoot() {
        if (!this._nestForLootSelector.nestId) {
            return this.$messages.choose_nest_for_loot;
        }

        return null;
    }

    _renderNestForLootError(errText) {
        this._nestForLootErrContainer.innerHTML = errText || '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return
        }

        let warriorsCount = this._warriorsCountView.value;
        let workersCount = this._workersCountView.value;
        let nestForLootId = this._nestForLootSelector.nestId;
        let nestToPillageId = this._nestToPillageView.value.id;
        try {
            await this.$domainFacade.pillageNestOperation(this._performingColony.id, nestToPillageId, nestForLootId, warriorsCount, workersCount);
            this._onDone();
        } catch (e) {
            if (e instanceof StateSyncRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError('SOMETHING_WENT_WRONG');
            }
        }
    }

    _showMarkers() {
        let markers = [];

        if (this._nestToPillageView.value) {
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.PILLAGE, this._nestToPillageView.value.position));
        }

        if (this._nestForLootSelector.nestId) {
            let nestForLoot = this.$domainFacade.findEntityById(this._nestForLootSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.LOAD, nestForLoot.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

    _renderMainError(messageId) {
        this._errorContainerEl.innerHTML = messageId ? this.$messages[messageId] : '';
    }

}

export {
    PillageNestOperationCreatorView
}