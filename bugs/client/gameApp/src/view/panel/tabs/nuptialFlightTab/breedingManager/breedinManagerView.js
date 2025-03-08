import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import breedingManagerTmpl from './breedingManagerTmpl.html';
import { QueenSelectorView } from "./queenSelector/queenSelectorView";
import { MaleSelectorView } from "./maleSelector/maleSelectorView";
import { PositionView } from "@view/panel/base/position/positionView";
import { MarkerTypes } from '@domain/enum/markerTypes';
import { TextInputView } from "@view/panel/base/textInput/textInputView";
import { StateSyncRequestError } from "@domain/errors/stateSyncRequestError";
import { GenericRequestError } from "@domain/errors/genericRequestError";

class BreedingManagerView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._chooseNestPositionBtn.addEventListener('click', this._onChooseNestPositionBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
    }

    _render() {
        this._el.innerHTML = breedingManagerTmpl;

        this._queenSelectorView = new QueenSelectorView(this._el.querySelector('[data-queen-selector]'));
        this._malesSelectorView = new MaleSelectorView(this._el.querySelector('[data-males-search]'));
        this._nestPositionView = new PositionView(this._el.querySelector('[data-building-site]'));
        this._colonyNameView = new TextInputView(this._el.querySelector('[data-colony-name]'), this._el.querySelector('[data-colony-name-error-container]'));
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');
        this._startBtn = this._el.querySelector('[data-start]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');
        this._chooseNestPositionBtn = this._el.querySelector('[data-choose-nest-position]');
        this._queenErrorContainerEl = this._el.querySelector('[data-queen-error-container]');
        this._maleErrorContainerEl = this._el.querySelector('[data-male-error-container]');
        this._nestPositionErrorContainerEl = this._el.querySelector('[data-nest-position-error-container]');
    }

    _validate() {
        let isError = false;

        if (!this._colonyNameView.validate()) {
            isError = true;
        }

        let nestPositionErrId = this._validateNestPosition();
        this._renderNestPositionError(nestPositionErrId);
        if (nestPositionErrId) {
            isError = true;
        }

        let queenErrorId = this._validateQueen();
        this._renderQueenError(queenErrorId);
        if (queenErrorId) {
            isError = true;
        }

        let maleErrorId = this._validaMale();
        this._renderMaleError(maleErrorId);
        if (maleErrorId) {
            isError = true;
        }

        return !isError;
    }

    _validateQueen() {
        if (!this._queenSelectorView.queen) {
            return 'QUEEN_IS_NECESSARY_FOR_BREEDING';
        }

        if (this._queenSelectorView.queen && this._queenSelectorView.queen.isDied) {
            return 'LIVE_QUEEN_IS_NECESSARY_FOR_BREEDING';
        }

        return null;
    }

    _renderQueenError(queenErrorId) {
        this._queenErrorContainerEl.innerHTML = queenErrorId ? this.$messages[queenErrorId] : '';
    }

    _validaMale() {
        if (!this._malesSelectorView.selectedMale) {
            return 'MALE_IS_NECESSARY_FOR_BREEDING';
        }

        return null;
    }

    _renderMaleError(errId) {
        this._maleErrorContainerEl.innerHTML = errId ? this.$messages[errId] : '';
    }

    _validateNestPosition() {
        if (!this._nestPositionView.value) {
            return 'queen_needs_place_to_settle';
        }

        return null;
    }

    _renderNestPositionError(errId) {
        this._nestPositionErrorContainerEl.innerHTML = errId ? this.$messages[errId] : '';
    }

    async _onStartBtnClick() {
        if (!this._validate()) {
            return;
        }

        try {
            await this.$domainFacade.foundColony(
                this._queenSelectorView.queen.id,
                this._malesSelectorView.selectedMale.id,
                this._nestPositionView.value,
                this._colonyNameView.value
            );
            this.$eventBus.emit('showPointRequest', this._nestPositionView.value);
            this._resetFields();
        } catch (e) {
            if (e instanceof StateSyncRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderRequestError('SOMETHING_WENT_WRONG');
            }
        }
    }

    _resetFields() {
        if (this._nestPositionView.value) {
            this._nestPositionView.value = null;
            this.$eventBus.emit('hideMarkersRequest');
        }

        this._colonyNameView.value = '';
    }

    _onChooseNestPositionBtnClick() {
        this.$eventBus.emit('positionPickRequest', null, (point) => { 
            this._nestPositionView.value = point;
            this._showMarker();
        });
    }

    _showMarker() {
        let markers = [this.$domainFacade.buildMarker(MarkerTypes.POINTER, this._nestPositionView.value)];
        this.$eventBus.emit('showMarkersRequest', markers);
    }

    _renderRequestError(errId) {
        this._errorContainerEl.innerHTML = this.$messages[errId];
    }

    _onSomeTabSwitched() {
        this._resetFields();
    }

}

export {
    BreedingManagerView
}