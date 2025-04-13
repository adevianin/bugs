import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import bringBugOperationCreatorTmpl from './bringBugOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { doubleClickProtection } from "@common/utils/doubleClickProtection";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";

class BringBugOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._closestBugCorpse = null;

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

        this._showMarkers();
    }

    _validate() {
        let isError = false;

        let nestError = this._validateNest();
        this._renderNestError(nestError);
        if (nestError) {
            isError = true;
        }

        let bugCorpseError = this._validateClosestBugCorpse();
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

    _validateClosestBugCorpse() {
        if (this._nestSelector.nestId && (!this._closestBugCorpse || this._closestBugCorpse.isDied)) {
            return GAME_MESSAGE_IDS.BRING_BUG_OPER_NO_BUG_FOUND;
        }

        return null;
    }

    _renderBugCorpseError(errId) {
        this._bugCorpseErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return;
        }

        try {
            this._loader.toggle(true);
            let operationId = await this.$domain.bringBugOpearation(this._performingColony.id, this._nestSelector.nestId);
            this._performingColony.waitCreatingOperation(operationId, () => {
                this._onDone();
                this._loader.toggle(false);
            });
        } catch(e) {
            this._loader.toggle(false);
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
        }
    }

    _onNestChanged() {
        if (this._nestSelector.nestId) {
            this._closestBugCorpse = this.$domain.findClosestBugCorpseNearNest(this._nestSelector.nestId);
        } else {
            this._closestBugCorpse = null;
        }
        this._validate();
        this._showMarkers();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nest = this.$domain.findEntityById(this._nestSelector.nestId);
            markers.push(this.$domain.buildMarker(MarkerTypes.LOAD, nest.position));
        }

        if (this._closestBugCorpse) {
            markers.push(this.$domain.buildMarker(MarkerTypes.EAT, this._closestBugCorpse.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    BringBugOperationCreatorView
}