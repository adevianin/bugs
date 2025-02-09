import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import destroyNestOperationCreatorTmpl from './destroyNestOperationCreatorTmpl.html';
import { MarkerTypes } from "@domain/enum/markerTypes";

class DestroyNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._choosedNest = null;

        this._render();
        this._chooseNestBtn.addEventListener('click', this._onChooseNestBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = destroyNestOperationCreatorTmpl;
        this._choosedNestEl = this._el.querySelector('[data-choosed-nest]');
        this._chooseNestBtn = this._el.querySelector('[data-choose-nest-btn]');
        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._warriorsCountEl = this._el.querySelector('[data-warriors-count]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');
        this._renderChoosedNest();
    }

    _renderChoosedNest() {
        this._choosedNestEl.innerHTML = this._choosedNest ? `(${ this._choosedNest.id })` : '(не вибрано)';
    }

    _onChooseNestBtnClick() {
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, (nest) => {
            this._choosedNest = nest;
            this._renderChoosedNest();
            this._showMarkers();
        });
    }

    _onStartBtnClick() {
        if (!this._choosedNest) {
            return
        }
        let warriorsCount = parseInt(this._warriorsCountEl.value);
        let workersCount = parseInt(this._workersCountEl.value);
        this.$domainFacade.destroyNestOperation(this._performingColony.id, warriorsCount, workersCount, this._choosedNest)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
    }

    _showMarkers() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.CROSS, this._choosedNest.position)];
        this._demonstrateMarkersRequest(markers);
    }

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }
}

export {
    DestroyNestOperationCreatorView
}