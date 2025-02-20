import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/game/panel/base/intInput/intInputView";
import { NestInlineView } from "@view/game/panel/base/nest/nestInlineView";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._nestForLoot = null;

        this._render();

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

        this._nestForLootSelector = new NestSelectorView(this._performingColony.id)
        this._el.querySelector('[data-nest-selector-container]').append(this._nestForLootSelector.el);

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

    _onNestForLootChanged() {
        this._showMarkers();
    }

    _onChooseNestToPillageBtnClick() {
        let queenOfColony = this.$domainFacade.getQueenOfColony(this._performingColony.id);
        let pickableCircle = { center: queenOfColony.position, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET };
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, pickableCircle, (nestToPillage) => {
            this._nestToPillageView.value = nestToPillage;
            this._showMarkers();
        });
    }

    _validate() {
        let isError = false;

        let nestToPillageError = this._validateChoosedNestToPillage();
        this._renderNestToPillageError(nestToPillageError);
        if (nestToPillageError) {
            isError = true;
        }

        if (!this._warriorsCountView.validate()) {
            isError = true;
        }

        if (!this._workersCountView.validate()) {
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

    _onStartBtnClick() {
        if (!this._validate()) {
            return
        }

        let warriorsCount = this._warriorsCountView.value;
        let workersCount = this._workersCountView.value;
        let nestForLootId = this._nestForLootSelector.nestId;
        let nestToPillageId = this._nestToPillageView.value.id;
        this.$domainFacade.pillageNestOperation(this._performingColony.id, nestToPillageId, nestForLootId, warriorsCount, workersCount)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
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

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }

}

export {
    PillageNestOperationCreatorView
}