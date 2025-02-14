import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._nestToPillage = null;
        this._nestForLoot = null;

        this._render();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestForLootSelector.events.addListener('changed', this._onNestForLootChanged.bind(this));
    }

    remove() {
        this._nestForLootSelector.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._chooseNestToPillageBtn = this._el.querySelector('[data-choose-nest-to-pillage]');
        this._nestToPillageEl = this._el.querySelector('[data-nest-to-pillage]');
        this._warriorsCountEl = this._el.querySelector('[data-warriors-count]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._nestForLootSelector = new NestSelectorView(this._performingColony.id)
        this._el.querySelector('[data-nest-selector-container]').append(this._nestForLootSelector.el);

        this._renderNestToPillage();
        this._showMarkers();
    }

    _renderNestToPillage() {
        this._nestToPillageEl.innerHTML = this._nestToPillage ? `(${ this._nestToPillage.id })` : '(не вибрано)';
    }

    _onNestForLootChanged() {
        this._showMarkers();
    }

    _onChooseNestToPillageBtnClick() {
        let queenOfColony = this.$domainFacade.getQueenOfColony(this._performingColony.id);
        let pickableCircle = { center: queenOfColony.position, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET };
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, pickableCircle, (nestToPillage) => {
            this._nestToPillage = nestToPillage;
            this._renderNestToPillage();
            this._showMarkers();
        });
    }

    _onStartBtnClick() {
        if (!this._nestToPillage) {
            return
        }

        let warriorsCount = parseInt(this._warriorsCountEl.value);
        let workersCount = parseInt(this._workersCountEl.value);
        let nestForLootId = this._nestForLootSelector.nestId;
        this.$domainFacade.pillageNestOperation(this._performingColony.id, this._nestToPillage.id, nestForLootId, warriorsCount, workersCount)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
    }

    _showMarkers() {
        let markers = [];

        if (this._nestToPillage) {
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.PILLAGE, this._nestToPillage.position));
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