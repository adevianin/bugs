import './style.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import breedingManagerTmpl from './breedingManagerTmpl.html';
import { QueenSelectorView } from "./queenSelector/queenSelectorView";
import { MaleSelectorView } from "./maleSelector/maleSelectorView";
import { PositionView } from "@view/panel/base/position/positionView";
import { MarkerTypes } from '@domain/enum/markerTypes';
import { TextInputView } from "@view/panel/base/textInput/textInputView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { CONSTS } from '@domain/consts';
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { ErrorCodes } from "@domain/enum/errorCodes";

class BreedingManagerView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._chooseNestPositionBtn.addEventListener('click', this._onChooseNestPositionBtnClick.bind(this));
        this._startBtn.addEventListener('click', doubleClickProtection(this._onStartBtnClick.bind(this)));
        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
        this._queenSelectorView.events.on('change', this._onSelectedQueenChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = breedingManagerTmpl;

        this._el.querySelector('[data-breeding-label-female]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_FEMALE);
        this._el.querySelector('[data-breeding-label-male]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_MALE);
        this._el.querySelector('[data-breeding-label-new-colony-name]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_NEW_COLONY_NAME);
        this._el.querySelector('[data-breeding-label-nest-position]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_NEST_POSITION);

        this._queenSelectorView = new QueenSelectorView(this._el.querySelector('[data-queen-selector]'));
        this._malesSelectorView = new MaleSelectorView(this._el.querySelector('[data-males-search]'));
        this._nestPositionView = new PositionView(this._el.querySelector('[data-building-site]'));
        this._colonyNameView = new TextInputView(this._el.querySelector('[data-colony-name]'), this._el.querySelector('[data-colony-name-error-container]'));
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');
        this._startBtn = this._el.querySelector('[data-start]');
        this._startBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_START);
        this._requestErrorContainerEl = this._el.querySelector('[data-request-error-container]');
        this._chooseNestPositionBtn = this._el.querySelector('[data-choose-nest-position]');
        this._chooseNestPositionBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.BREEDING_LABEL_CHOOSE_NEST_POSITION);
        this._queenErrorContainerEl = this._el.querySelector('[data-queen-error-container]');
        this._maleErrorContainerEl = this._el.querySelector('[data-male-error-container]');
        this._nestPositionErrorContainerEl = this._el.querySelector('[data-nest-position-error-container]');
    }

    async _validate() {
        let isError = false;

        if (!this._colonyNameView.validate()) {
            isError = true;
        }

        let nestPositionErrId = await this._validateNestPosition();
        this._renderNestPositionError(nestPositionErrId);
        if (nestPositionErrId) {
            isError = true;
        }

        let queenErrorId = await this._validateQueen();
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

    async _validateQueen() {
        let queenId = this._queenSelectorView.queen ? this._queenSelectorView.queen.id : null;
        return await this.$domain.validateBreedingQueen(queenId);
    }

    _renderQueenError(queenErrorId) {
        this._queenErrorContainerEl.innerHTML = queenErrorId ? this.$mm.get(queenErrorId) : '';
    }

    _validaMale() {
        if (!this._malesSelectorView.selectedMale) {
            return GAME_MESSAGE_IDS.BREEDING_MALE_NEEDED;
        }

        return null;
    }

    _renderMaleError(errId) {
        this._maleErrorContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _validateNestPosition() {
        return this.$domain.validateBuildingNewNestPosition(this._nestPositionView.value);
    }

    _renderNestPositionError(errId) {
        this._nestPositionErrorContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onStartBtnClick() {
        let isValid = await this._validate();
        if (!isValid) {
            return;
        }

        let result = await this.$domain.foundColony(
            this._queenSelectorView.queen.id,
            this._malesSelectorView.selectedMale.id,
            this._nestPositionView.value,
            this._colonyNameView.value
        );
        
        if (result.success) {
            this.$eventBus.emit('showPointRequest', this._nestPositionView.value);
            this._resetFields();
        } else {
            if (result.errCode == ErrorCodes.CONFLICT) {
                await this._validate();
            } else {
                console.error(result);
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
        this.$eventBus.emit('panelFoldRequest');
        this.$eventBus.emit('newNestPositionPickRequest', null, async (point) => { 
            this.$eventBus.emit('panelUnfoldRequest');
            this._nestPositionView.value = point;
            await this._showMarker();
            let nestPositionErrId = await this._validateNestPosition();
            this._renderNestPositionError(nestPositionErrId);
        });
    }

    async _showMarker() {
        let marker = await this.$domain.buildMarker(MarkerTypes.POINTER, this._nestPositionView.value, { area: CONSTS.NEST_AREA })
        let markers = [marker];
        this.$eventBus.emit('showMarkersRequest', markers);
    }

    _onSomeTabSwitched() {
        this._resetFields();
    }

    async _onSelectedQueenChanged() {
        let queenErrorId = await this._validateQueen();
        this._renderQueenError(queenErrorId);
    }

}

export {
    BreedingManagerView
}