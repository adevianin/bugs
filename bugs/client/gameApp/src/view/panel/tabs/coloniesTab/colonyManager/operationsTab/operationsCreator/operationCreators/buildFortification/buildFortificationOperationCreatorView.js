import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import buildFortificationOperationCreatorTmpl from './buildFortificationOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";

class BuildFortificationOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this._nestSelector.events.addListener('changed', this._onNestChanged.bind(this));

    }

    remove() {
        this._nestSelector.remove();
        this._workersCountView.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = buildFortificationOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._performingColony.id, this._el.querySelector('[data-nest-selector]'));

        let workersCountInput = this._el.querySelector('[data-workers-count]');
        let workersCountErrContainer = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCountView = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrContainer);

        this._requestErrorContainer = this._el.querySelector('[data-request-error-container]');

        this._startBtn = this._el.querySelector('[data-start-btn]');
        this._showMarkers();
    }

    _validate() {
        let isError = false;

        if (this._workersCountView.validate()) {
            isError = true;
        }

        return !isError;
    }

    _onStartBtnClick() {
        if (this._validate()) {
            return;
        }

        let nestId = this._nestSelector.nestId;
        let workersCount = this._workersCountView.value;
        this.$domainFacade.buildFortificationsOpearation(this._performingColony.id, nestId, workersCount)
            .then(() => {
                this._onDone();
            })
            .catch((errId) => {
                this._renderRequestContainerError(errId);
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

    _renderRequestContainerError(messageId) {
        this._requestErrorContainer.innerHTML = this.$messages[messageId];
    }

}

export {
    BuildFortificationOperationCreatorView
}