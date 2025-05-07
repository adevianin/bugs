import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/panel/base/nest/nestInlineView";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { ErrorCodes } from "@domain/enum/errorCodes";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._mainNest = this.$domain.getMainNestOfMyColony(this._performingColony.id);
        this._nestToPillageData = null;

        this._render();

        this._checkOperationConditions();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this._nestForLootSelector.events.on('changed', this._onNestForLootChanged.bind(this));
    }

    remove() {
        this._nestToPillageView.remove();
        this._nestForLootSelector.remove();
        this._warriorsCountView.remove();
        this._workersCountView.remove();
        this._loader.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._chooseNestToPillageBtn = this._el.querySelector('[data-choose-nest-to-pillage]');
        this._chooseNestToPillageBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_CHOOSE_NEST_TO_PILLAGE_BTN_LABEL);
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
        this._startBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_START_BTN_LABEL);
        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._showMarkers();

        this._el.querySelector('[data-operation-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_TITLE);
        this._el.querySelector('[data-nest-to-pillage-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_TO_PILLAGE_LABEL);
        this._el.querySelector('[data-nest-for-loot-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.PILLAGE_NEST_OP_CR_NEST_FOR_LOOT_LABEL);
        this._el.querySelector('[data-warriors-count-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_WARRIORS_COUNT);
        this._el.querySelector('[data-workers-count-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_CREATOR_WORKERS_COUNT);
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

    async _checkOperationConditions() {
        let condErr = await this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
    }

    _onNestForLootChanged() {
        let nestForLootError = this._validateChoosedNestForLoot();
        this._renderNestForLootError(nestForLootError);
        this._showMarkers();
    }

    _onChooseNestToPillageBtnClick() {
        this.$eventBus.emit('raidNestPickRequest', this._performingColony.id, this._mainNest.position, async (nestId) => {
            let nestData = await this.$domain.getEntityDataById(nestId);
            this._nestToPillageView.setNestData(nestData);
            this._nestToPillageData = nestData;
            this._showMarkers();
            let nestToPillageError = await this._validateChoosedNestToPillage();
            this._renderNestToPillageError(nestToPillageError);
        });
    }

    async _validate() {
        let isError = false;

        let nestToPillageError = await this._validateChoosedNestToPillage();
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

        let condErr = await this._validateOperationConditions();
        this._renderOperationConditionsErr(condErr);
        if (condErr) {
            isError = true;
        }

        return !isError;
    }

    _validateChoosedNestToPillage() {
        let nestToPillageId = this._nestToPillageData ? this._nestToPillageData.id : null;
        return this.$domain.validateNestToPillage(nestToPillageId);
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
        let isValid = await this._validate();
        if (!isValid) {
            return
        }

        let warriorsCount = this._warriorsCountView.value;
        let workersCount = this._workersCountView.value;
        let nestForLootId = this._nestForLootSelector.nestId;
        let nestToPillageId = this._nestToPillageData.id;

        this._loader.toggle(true);
        let result = await this.$domain.pillageNestOperation(this._performingColony.id, nestToPillageId, nestForLootId, warriorsCount, workersCount);

        if (result.success) {
            this._waitAddingOperation(result.operationId, () => {
                this._onDone();
            });
        } else {
            this._loader.toggle(false);
            if (result.errCode == ErrorCodes.CONFLICT) {
                await this._validate();
            } else {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

    async _showMarkers() {
        let markers = [];

        if (this._nestToPillageData) {
            let nestToPillageMarker = await this.$domain.buildMarker(MarkerTypes.PILLAGE, this._nestToPillageData.position)
            markers.push(nestToPillageMarker);
        }

        if (this._nestForLootSelector.nestId) {
            let nestForLoot = this.$domain.myState.getNestById(this._nestForLootSelector.nestId);
            let nestForLootMarker = await this.$domain.buildMarker(MarkerTypes.LOAD, nestForLoot.position);
            markers.push(nestForLootMarker);
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    PillageNestOperationCreatorView
}