import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { NestView } from './nestView';
import nestsSelectTmpl from './nestsSelectTmpl.html';
import arrowToRightSvgTmpl from '@view/panel/svg/arrowToRight.html';
import arrowToLeftSvgTmpl from '@view/panel/svg/arrowToLeft.html';

class NestsSelectView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._nests = [];
        this._selectedNestView = null;
        this._selectedNestIndex = null;

        this._render();

        this._prevBtn.addEventListener('click', this._onPrevNestBtnClick.bind(this));
        this._nextBtn.addEventListener('click', this._onNextNestBtnClick.bind(this));
        this.$domain.myState.on('nestBorn', this._onNestBorn.bind(this));
        this.$domain.myState.on('nestDied', this._onNestDied.bind(this));
    }

    manageColony(colony, nestToSelect) {
        this._colony = colony;
        this._nests = this.$domain.getMyNestsFromMyColony(colony.id);
        let selectingNest = nestToSelect || this._nests[0];
        if (selectingNest) {
            this._selectNest(selectingNest);
        } else {
            this._clearSelectedNest();
            this._renderChooseBtnsState();
        }
    }

    get selectedNest() {
        let selectedNestId = this._selectedNestId;
        return this._nests.find(n => n.id == selectedNestId);
    }

    _render() {
        this._el.innerHTML = nestsSelectTmpl;

        this._selectedNestContainer = this._el.querySelector('[data-selected-nest-container]');
        this._prevBtn = this._el.querySelector('[data-prev-nest]');
        this._prevBtn.innerHTML = arrowToLeftSvgTmpl;
        this._nextBtn = this._el.querySelector('[data-next-nest]');
        this._nextBtn.innerHTML = arrowToRightSvgTmpl;
    }

    get _selectedNestId() {
        if (this._hasSelectedNest) {
            return this._nests[this._selectedNestIndex].id;
        }

        return null;
    }

    get _hasSelectedNest() {
        return this._selectedNestIndex != null && this._selectedNestIndex >= 0;
    }

    _selectNest(nest) {
        this._clearSelectedNest();
        this._selectedNestIndex = this._nests.indexOf(nest);

        let el = document.createElement('div');
        this._selectedNestView = new NestView(el, nest);
        this._selectedNestContainer.append(el);

        this._renderChooseBtnsState();
        
        this._emitChange();
    }

    _clearSelectedNest() {
        this._selectedNestIndex = null;
        if (this._selectedNestView) {
            this._selectedNestView.remove();
            this._selectedNestView = null;
        }
    }

    _selectPrevNest() {
        let nest = this._nests[this._selectedNestIndex - 1];
        this._selectNest(nest);
    }

    _selectNextNest() {
        let nest = this._nests[this._selectedNestIndex + 1];
        this._selectNest(nest);
    }

    _checkHasPrevNest() {
        return this._selectedNestIndex > 0;
    }

    _checkHasNextNest() {
        return !!this._nests[this._selectedNestIndex + 1];
    }

    _renderChooseBtnsState() {
        this._prevBtn.disabled = !this._checkHasPrevNest();
        this._nextBtn.disabled = !this._checkHasNextNest();
    }

    _emitChange() {
        this.events.emit('selectedNestChanged');
    }

    _deleteNestEntity(nest) {
        let index = this._nests.indexOf(nest);
        if (index != -1) {
            this._nests.splice(index, 1);
        }
    }

    _checkIsMyNest(nest) {
        return this._colony && nest.fromColony == this._colony.id;
    }

    _onPrevNestBtnClick() {
        if (this._checkHasPrevNest()) {
            this._selectPrevNest();
        }
    }

    _onNextNestBtnClick() {
        if (this._checkHasNextNest()) {
            this._selectNextNest();
        }
    }

    _onNestBorn(nest) {
        if (this._checkIsMyNest(nest)) {
            this._nests.push(nest);
            this._renderChooseBtnsState();
            if (!this._hasSelectedNest) {
                this._selectNest(nest);
            }
        }
    }

    _onNestDied(nest) {
        if (this._checkIsMyNest(nest)) {
            let isSelectedNestDied = this._selectedNestId == nest.id;
            if (isSelectedNestDied) {
                if (this._checkHasPrevNest()) {
                    this._selectPrevNest();
                } else if (this._checkHasNextNest()) {
                    this._selectNextNest();
                }
            }

            let selectedNest = this.selectedNest;
            this._deleteNestEntity(nest);
            this._selectedNestIndex = this._nests.indexOf(selectedNest);
            this._renderChooseBtnsState();
        }
    }

}

export {
    NestsSelectView
}