import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import bringBugOperationCreatorTmpl from './bringBugOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";

class BringBugOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestSelector.events.addListener('changed', this._onNestChanged.bind(this));
    }

    remove() {
        this._nestSelector.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = bringBugOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._performingColony.id, this._el.querySelector('[data-nest-selector]'));
        this._requestErrorContainerEl = this._el.querySelector('[data-request-error-container]');

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._showMarkers();
    }

    _onStartBtnClick() {
        let nestId = this._nestSelector.nestId;
        this.$domainFacade.bringBugOpearation(this._performingColony.id, nestId)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderRequestError(errId);
            })
    }

    _renderRequestError(messageId) {
        this._requestErrorContainerEl.innerHTML = this.$messages[messageId];
    }

    _onNestChanged() {
        this._showMarkers();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nest = this.$domainFacade.findEntityById(this._nestSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.LOAD, nest.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    BringBugOperationCreatorView
}