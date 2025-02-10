import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import transportFoodOperationCreatorTmpl from './transportFoodOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";

class TransportFoodOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestSelectorFrom.events.addListener('changed', this._onNestFromChanged.bind(this));
        this._nestSelectorTo.events.addListener('changed', this._onNestToChanged.bind(this));

    }

    remove() {
        this._nestSelectorFrom.remove();
        this._nestSelectorTo.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = transportFoodOperationCreatorTmpl;

        this._nestSelectorFrom = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-from-nest-selector-container]').append(this._nestSelectorFrom.el);

        this._nestSelectorTo = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-to-nest-selector-container]').append(this._nestSelectorTo.el);

        this._workersCountInput = this._el.querySelector('[data-workers-count]');
        this._warriorsCountInput = this._el.querySelector('[data-warriors-count]');

        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._showMarkers();
    }

    _onStartBtnClick() {
        let performingColonyId = this._performingColony.id;
        let fromNestId = this._nestSelectorFrom.nestId;
        let toNestId = this._nestSelectorTo.nestId;
        let workersCount = this._workersCountInput.value;
        let warriorsCount = this._warriorsCountInput.value;
        this.$domainFacade.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
    }

    _onNestFromChanged() {
        this._showMarkers();
    }

    _onNestToChanged() {
        this._showMarkers();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestSelectorFrom.nestId) {
            let nestFrom = this.$domainFacade.findEntityById(this._nestSelectorFrom.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.UNLOAD, nestFrom.position));
        }

        if (this._nestSelectorTo.nestId) {
            let nestFrom = this.$domainFacade.findEntityById(this._nestSelectorTo.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.LOAD, nestFrom.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }

}

export {
    TransportFoodOperationCreatorView
}