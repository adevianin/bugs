import { BaseHTMLView } from "@view/base/baseHTMLView";
import breedingManagerTmpl from './breedingManagerTmpl.html';
import { QueenSelectorView } from "./queenSelector/queenSelectorView";
import { MalesSearchView } from "./malesSearch";
import { PositionView } from "@view/panel/base/position/positionView";
import { MarkerTypes } from '@domain/enum/markerTypes';

class BreedingManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._chooseNestPositionBtn.addEventListener('click', this._onChooseNestPositionBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
    }

    _render() {
        this._el.innerHTML = breedingManagerTmpl;

        this._queenSelectorView = new QueenSelectorView(this._el.querySelector('[data-queen-selector]'));
        this._malesSearchView = new MalesSearchView(this._el.querySelector('[data-males-search]'));
        this._nestPositionView = new PositionView(this._el.querySelector('[data-building-site]'));
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');
        this._colonyNameEl = this._el.querySelector('[data-colony-name]');
        this._startBtn = this._el.querySelector('[data-start]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');
        this._chooseNestPositionBtn = this._el.querySelector('[data-choose-nest-position]');
    }

    _onStartBtnClick() {
        if (!this._queenSelectorView.queenId || !this._nestPositionView.value || !this._colonyNameEl.value || !this._malesSearchView.selectedMale) {
            return
        }

        this.$domainFacade.foundColony(this._queenSelectorView.queenId, this._malesSearchView.selectedMale.id, this._nestPositionView.value, this._colonyNameEl.value)
            .then(() => {
                this._resetFields();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
    }

    _resetFields() {
        if (this._nestPositionView.value) {
            this._nestPositionView.value = null;
            this.$eventBus.emit('hideMarkersRequest');
        }
    }

    _onChooseNestPositionBtnClick() {
        this.$eventBus.emit('positionPickRequest', null, (point) => { 
            this._nestPositionView.value = point;
            this._showMarker();
        });
    }

    _showMarker() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.POINTER, this._nestPositionView.value)];
        this.$eventBus.emit('showMarkersRequest', markers);
    }

    _renderError(errId) {
        this._errorContainerEl.innerHTML = this.$messages[errId];
    }

    _onSomeTabSwitched() {
        this._resetFields();
    }

}

export {
    BreedingManagerView
}