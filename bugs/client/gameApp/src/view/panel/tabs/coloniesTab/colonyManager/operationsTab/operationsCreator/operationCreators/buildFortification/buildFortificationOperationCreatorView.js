import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import buildFortificationOperationCreatorTmpl from './buildFortificationOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { CONSTS } from "@domain/consts";
import { IntInputView } from "@view/panel/base/intInput/intInputView";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { ErrorCodes } from "@domain/enum/errorCodes";

class BuildFortificationOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this._nestSelector.events.on('changed', this._onNestChanged.bind(this));

    }

    remove() {
        this._nestSelector.remove();
        this._workersCountView.remove();
        this._loader.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = buildFortificationOperationCreatorTmpl;

        this._nestErrContainer = this._el.querySelector('[data-nest-err]');
        this._nestSelector = new NestSelectorView(this._el.querySelector('[data-nest-selector]'), this._performingColony.id);

        let workersCountInput = this._el.querySelector('[data-workers-count]');
        let workersCountErrContainer = this._el.querySelector('[data-workers-count-err]');
        let minWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MIN_WORKERS_COUNT;
        let maxWorkersCount = CONSTS.PILLAGE_NEST_OPERATION_REQUIREMENTS.MAX_WORKERS_COUNT;
        this._workersCountView = new IntInputView(workersCountInput, minWorkersCount, maxWorkersCount, workersCountErrContainer);

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._showMarkers();
    }

    _validate() {
        let isError = false;

        let nestError = this._validateNest();
        this._renderNestError(nestError);
        if (nestError) {
            isError = true;
        }

        if (!this._workersCountView.validate()) {
            isError = true;
        }

        return !isError;
    }

    _validateNest() {
        if (!this._nestSelector.nestId) {
            return GAME_MESSAGE_IDS.BUILD_FORTIFICATION_OPER_NEST_NEEDED;
        }

        return null;
    }

    _renderNestError(errId) {
        this._nestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return;
        }

        let nestId = this._nestSelector.nestId;
        let workersCount = this._workersCountView.value;

        this._loader.toggle(true);
        let result = await this.$domain.buildFortificationsOpearation(this._performingColony.id, nestId, workersCount);

        if (result.success) {
            this._waitAddingOperation(result.operationId, () => {
                this._onDone();
            });
        } else {
            this._loader.toggle(false);
            if (result.errCode == ErrorCodes.CONFLICT) {
                this._validate();
            } else {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

    _onNestChanged() {
        this._validate();
        this._showMarkers();
    }

    async _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nestData = await this.$domain.getEntityDataById(this._nestSelector.nestId);
            let marker = await this.$domain.buildMarker(MarkerTypes.SHIELD, nestData.position);
            markers.push(marker);
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    BuildFortificationOperationCreatorView
}