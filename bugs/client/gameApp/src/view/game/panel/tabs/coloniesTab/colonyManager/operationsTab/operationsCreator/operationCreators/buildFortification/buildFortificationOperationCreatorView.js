import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import buildFortificationOperationCreatorTmpl from './buildFortificationOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";

class BuildFortificationOperationCreatorView extends BaseOperationCreatorView {

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
        this._el.innerHTML = buildFortificationOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-nest-selector]').append(this._nestSelector.el);

        this._workersCountInput = this._el.querySelector('[data-workers-count]');

        this._errorContainerEl = this._el.querySelector('[data-error-container]');

        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._showMarkers();
    }

    _onStartBtnClick() {
        let nestId = this._nestSelector.nestId;
        let workersCount = this._workersCountInput.value;
        this.$domainFacade.buildFortificationsOpearation(this._performingColony.id, nestId, workersCount)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderError(errId);
            });
    }

    _onNestChanged() {
        this._showMarkers();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nest = this.$domainFacade.findEntityById(this._nestSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.SHIELD, nest.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

    _renderError(messageId) {
        this._errorContainerEl.innerHTML = this.$messages[messageId];
    }

}

export {
    BuildFortificationOperationCreatorView
}