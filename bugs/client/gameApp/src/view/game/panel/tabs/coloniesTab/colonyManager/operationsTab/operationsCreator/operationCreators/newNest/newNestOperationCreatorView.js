import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";

class NewNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._buildingSite = null;

        this._render();

        this._chooseBuildingSiteBtn.addEventListener('click', this._onChooseBuildingSiteBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = newNestOperationCreatorTmpl;

        this._chooseBuildingSiteBtn = this._el.querySelector('[data-choose-nest-position]');
        this._startBtn = this._el.querySelector('[data-start]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._warriorsCountEl = this._el.querySelector('[data-warriors-count]');
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');
        this._nestNameEl = this._el.querySelector('[data-nest-name]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._renderBuildingSite();
        this._checkQueenExisting();
    }

    _renderBuildingSite() {
        if (this._buildingSite) {
            this._buildingSiteEl.innerHTML = `(${this._buildingSite.x};${this._buildingSite.y})`;
        } else {
            this._buildingSiteEl.innerHTML = 'не задано';
        }
    }

    _onChooseBuildingSiteBtnClick() {
        this.$eventBus.emit('positionPickRequest', (point) => { 
            this._buildingSite = point;
            this._renderBuildingSite();
            this._showMarkers();
        });
    }

    _onStartBtnClick() {
        if (!this._buildingSite) {
            return
        }
        let workersCount = parseInt(this._workersCountEl.value);
        let warriorsCount = parseInt(this._warriorsCountEl.value);
        let nestName = this._nestNameEl.value;
        this.$domainFacade.buildNewSubNestOperation(this._performingColony.id, this._buildingSite, workersCount, warriorsCount, nestName)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            })
    }

    _checkQueenExisting() {
        let queen = this.$domainFacade.getQueenOfColony(this._performingColony.id);
        if (!queen) {
            this._renderError('CANT_BUILD_SUB_NEST_WITHOUT_QUEEN');
        }
    }

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }

    _showMarkers() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.POINTER, this._buildingSite)];
        this._demonstrateMarkersRequest(markers);
    }

}

export { NewNestOperationCreatorView }