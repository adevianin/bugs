import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/panel/base/nest/nestInlineView";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._mainNest = this.$domain.getMainNestOfColony(this._performingColony.id);
        this._nestToPillage = null;

        this._render();

        this._checkOperationConditions();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestForLootSelector.events.on('changed', this._onNestForLootChanged.bind(this));
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
        this._nestForLootSelector = new NestSelectorView(this._el.querySelector('[data-nest-selector]'), this._performingColony.id);

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

    _validateOperationConditions() {
        return this.$domain.validatePillageNestOperationConditions(this._performingColony.id);
    }

    _renderOperationConditionsErr(condErr) {
        this._renderMainError(condErr);
        this._chooseNestToPillageBtn.disabled = !!condErr;
        this._startBtn.disabled = !!condErr;
    }

    _renderMainError(messageId) {
        this._errorContainerEl.innerHTML = messageId ? this.$mm.get(messageId) : '';
    }

    _checkOperationConditions() {
        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
    }

    _onNestForLootChanged() {
        let nestForLootError = this._validateChoosedNestForLoot();
        this._renderNestForLootError(nestForLootError);
        this._showMarkers();
    }

    _onChooseNestToPillageBtnClick() {
        this.$eventBus.emit('raidNestPickRequest', this._performingColony.id, this._mainNest.position, (nest) => {
            this._nestToPillageView.value = nest;
            this._nestToPillage = nest;
            this._showMarkers();
            let nestToPillageError = this._validateChoosedNestToPillage();
            this._renderNestToPillageError(nestToPillageError);
        });
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

        let condErr = this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    _validateChoosedNestToPillage() {
        if (!this._nestToPillage) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED;
        }

        if (this._nestToPillage.isDied) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED;
        }

        return null;
    }

    _renderNestToPillageError(errId) {
        this._nestToPillageErrorContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateChoosedNestForLoot() {
        if (!this._nestForLootSelector.nestId) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_FOR_LOOT_NEEDED;
        }

        return null;
    }

    _renderNestForLootError(errId) {
        this._nestForLootErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return
        }

        let warriorsCount = this._warriorsCountView.value;
        let workersCount = this._workersCountView.value;
        let nestForLootId = this._nestForLootSelector.nestId;
        let nestToPillageId = this._nestToPillage.id;
        try {
            await this.$domain.pillageNestOperation(this._performingColony.id, nestToPillageId, nestForLootId, warriorsCount, workersCount);
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
        let markers = [];

        if (this._nestToPillage) {
            markers.push(this.$domain.buildMarker(MarkerTypes.PILLAGE, this._nestToPillage.position));
        }

        if (this._nestForLootSelector.nestId) {
            let nestForLoot = this.$domain.findEntityById(this._nestForLootSelector.nestId);
            markers.push(this.$domain.buildMarker(MarkerTypes.LOAD, nestForLoot.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    PillageNestOperationCreatorView
}