import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import bringBugOperationCreatorTmpl from './bringBugOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/panel/base/nestSelector";
import { MarkerTypes } from "@domain/enum/markerTypes";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class BringBugOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._closestBugCorpse = null;

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

        this._nestSelector = new NestSelectorView(this._el.querySelector('[data-nest-selector]'), this._performingColony.id);
        this._nestErrContainer = this._el.querySelector('[data-nest-err]');

        this._bugCorpseErrContainer = this._el.querySelector('[data-bug-corpse-err]');

        this._startBtn = this._el.querySelector('[data-start-btn]');

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
            return this.$messages.choose_nest_with_bug_nearby;
        }

        return null
    }

    _renderNestError(errorText) {
        this._nestErrContainer.innerHTML = errorText || '';
    }

    _validateClosestBugCorpse() {
        if (this._nestSelector.nestId && (!this._closestBugCorpse || this._closestBugCorpse.isDied)) {
            return this.$messages.bug_corpse_not_found;
        }

        return null;
    }

    _renderBugCorpseError(errText) {
        this._bugCorpseErrContainer.innerHTML = errText || '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return;
        }

        try {
            await this.$domainFacade.bringBugOpearation(this._performingColony.id, this._nestSelector.nestId);
            this._onDone();
        } catch(e) {
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderMainError('SOMETHING_WENT_WRONG');
            }
        }
    }

    _onNestChanged() {
        if (this._nestSelector.nestId) {
            this._closestBugCorpse = this.$domainFacade.findClosestBugCorpseNearNest(this._nestSelector.nestId);
        } else {
            this._closestBugCorpse = null;
        }
        this._validate();
        this._showMarkers();
    }

    _showMarkers() {
        let markers = [];

        if (this._nestSelector.nestId) {
            let nest = this.$domainFacade.findEntityById(this._nestSelector.nestId);
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.LOAD, nest.position));
        }

        if (this._closestBugCorpse) {
            markers.push(this.$domainFacade.buildMarker(MarkerTypes.EAT, this._closestBugCorpse.position));
        }

        this._demonstrateMarkersRequest(markers);
    }

}

export {
    BringBugOperationCreatorView
}