import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import bringBugOperationCreatorTmpl from './bringBugOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { ErrorCodes } from "@domain/enum/errorCodes";

class BringBugOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._closestBugCorpseData = null;

        this._render();

        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this._nestSelector.events.on('changed', this._onNestChanged.bind(this));
    }

    remove() {
        this._nestSelector.remove();
        this._loader.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = bringBugOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._el.querySelector('[data-nest-selector]'), this._performingColony.id);
        this._nestErrContainer = this._el.querySelector('[data-nest-err]');

        this._bugCorpseErrContainer = this._el.querySelector('[data-bug-corpse-err]');

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        // this._showMarkers();

        this._el.querySelector('[data-operation-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BRING_BUG_OP_CR_TITLE);
        this._el.querySelector('[data-nest-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BRING_BUG_OP_CR_NEST_LABEL);
    }

    async _validate() {
        let isError = false;

        let nestError = this._validateNest();
        this._renderNestError(nestError);
        if (nestError) {
            isError = true;
        }

        let bugCorpseError = await this._validateClosestBugCorpse();
        this._renderBugCorpseError(bugCorpseError);
        if (bugCorpseError) {
            isError = true;
        }

        return !isError;
    }

    _validateNest() {
        if (!this._nestSelector.nestId) {
            return GAME_MESSAGE_IDS.BRING_BUG_OPER_NEST_NEEDED;
        }

        return null
    }

    _renderNestError(errId) {
        this._nestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _validateClosestBugCorpse() {
        if (this._closestBugCorpseData) {
            //refreshing data
            this._closestBugCorpseData = await this.$domain.getEntityDataById(this._closestBugCorpseData.id);
        }
        if (this._nestSelector.nestId && !this._closestBugCorpseData) {
            return GAME_MESSAGE_IDS.BRING_BUG_OPER_NO_BUG_FOUND;
        }

        return null;
    }

    _renderBugCorpseError(errId) {
        this._bugCorpseErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onStartBtnClick() {
        let isValid = await this._validate();
        if (!isValid) {
            return;
        }

        this._loader.toggle(true);

        let result = await this.$domain.bringBugOpearation(this._performingColony.id, this._nestSelector.nestId);

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

    async _onNestChanged() {
        if (this._nestSelector.nestId) {
            this._closestBugCorpseData = await this.$domain.findClosestBugCorpseNearNest(this._nestSelector.nestId);
        } else {
            this._closestBugCorpseData = null;
        }
        await this._validate();
        this._showMarkers();
    }

    async _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nest = await this.$domain.getEntityDataById(this._nestSelector.nestId);
            let marker = await this.$domain.buildMarker(MarkerTypes.LOAD, nest.position);
            markers.push(marker);
        }

        if (this._closestBugCorpseData) {
            let marker = await this.$domain.buildMarker(MarkerTypes.EAT, this._closestBugCorpseData.position);
            markers.push(marker);
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    BringBugOperationCreatorView
}