import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import queenSelectorTmpl from './queenSelectorTmpl.html';
import { QueenProfileView } from "./queenProfileView";
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';

class QueenSelectorView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._queens = this.$domain.myState.getAntsByIds(this.$domain.myState.nuptialEnvironment.queenIds);
        this._selectedQueenIndex = null;

        this._render();

        this.$domain.myState.nuptialEnvironment.on('queenFlewIn', this._onQueenFlewIn.bind(this));
        this.$domain.myState.nuptialEnvironment.on('queenFlewOut', this._onQueenFlewOut.bind(this));
        this.$domain.myState.on('antBorn', this._onAntBorn.bind(this));
        this.$domain.myState.on('antDied', this._onAntDied.bind(this));

        this._prevBtn.addEventListener('click', this._onPrevBtnClick.bind(this));
        this._nextBtn.addEventListener('click', this._onNextBtnClick.bind(this));
        this._bornAntaraBtn.addEventListener('click', doubleClickProtection(this._onBornNewAntaraBtnClick.bind(this)));

    }

    get queenId() {
        return this._hasSelectedQueen ? this._queens[this._selectedQueenIndex].id : null;
    }

    get queen() {
        return this._hasSelectedQueen ? this._queens[this._selectedQueenIndex] : null;
    }

    get _hasSelectedQueen() {
        return typeof this._selectedQueenIndex == 'number';
    }

    _render() {
        this._el.innerHTML = queenSelectorTmpl;

        this._queensEl = this._el.querySelector('[data-queens]');
        this._noQueensEl = this._el.querySelector('[data-no-queens]');
        this._prevBtn = this._el.querySelector('[data-previous-btn]');
        this._nextBtn = this._el.querySelector('[data-next-btn]');
        this._bornAntaraBtn = this._el.querySelector('[data-born-new-antara-btn]');

        this._queenProfileView = new QueenProfileView(this._el.querySelector('[data-queen-profile]'));
        this._bornAntaraLoader = new DotsLoaderView(this._el.querySelector('[data-born-antara-loader]'));

        this._renderIsEmptyState();
        this._renderChoosingBtnsState();
        this._renderBornAntaraBtnState();

        this._autoSelect();
    }

    _renderIsEmptyState() {
        let isEmpty = this._queens.length == 0;
        this._noQueensEl.classList.toggle('g-hidden', !isEmpty);
        this._queensEl.classList.toggle('g-hidden', isEmpty);
        if (isEmpty) {
            this._selectedQueenIndex = null;
        }
    }

    _renderBornAntaraBtnState() {
        let isAnyAnt = this.$domain.myState.ants.length > 0;
        this._bornAntaraBtn.classList.toggle('g-hidden', isAnyAnt);
    }

    _renderChoosingBtnsState() {
        this._nextBtn.disabled = this._selectedQueenIndex + 1 == this._queens.length;
        this._prevBtn.disabled = this._selectedQueenIndex == 0;
    }

    _autoSelect() {
        if (this._queens.length > 0) {
            this._selectQueen(0);
        }
    }

    _selectQueen(index) {
        this._selectedQueenIndex = index;
        let queen = this._queens[index];
        this._queenProfileView.showQueen(queen);
        this._renderChoosingBtnsState();
        this.events.emit('change');
    }

    _removeQueen(queen) {
        let selectedQueen = this._queens[this._selectedQueenIndex];
        let isRemovingSelectedQueen = selectedQueen.id == queen.id;
        this._queens = this._queens.filter( q => q.id != queen.id);
        if (isRemovingSelectedQueen) {
            this._selectedQueenIndex = null;
            this._autoSelect();
            this._renderIsEmptyState();
        } else {
            let newIndex = this._queens.indexOf(selectedQueen);
            this._selectQueen(newIndex);
        }
    }

    _findAndRemoveDied() {
        let diedQueens = [];
        for (let queen of this._queens) {
            if (queen.isDied) {
                diedQueens.push(queen);
            }
        }

        for (let queen of diedQueens) {
            this._removeQueen(queen);
        }
    }

    _addQueen(queen) {
        this._queens.push(queen);
        this._renderIsEmptyState();
        this._renderChoosingBtnsState();
        if (!this._hasSelectedQueen) {
            this._selectQueen(0);
        }
    }

    _onPrevBtnClick() {
        this._selectQueen(this._selectedQueenIndex - 1);
        this._findAndRemoveDied();
    }

    _onNextBtnClick() {
        this._selectQueen(this._selectedQueenIndex + 1);
        this._findAndRemoveDied();
    }

    _checkIdInQueensList(id) {
        let queensIds = this._queens.map(queen => queen.id);
        return queensIds.includes(id);
    }

    _onQueenFlewIn(queenId) {
        let queen = this.$domain.myState.getAntById(queenId);
        this._addQueen(queen);
    }

    _onQueenFlewOut(queenId) {
        let queen = this._queens.find(q => q.id == queenId);
        this._removeQueen(queen);
    }

    _onAntBorn() {
        this._bornAntaraLoader.toggle(false);
        this._renderBornAntaraBtnState();
    }
    
    _onAntDied() {
        this._renderBornAntaraBtnState();
    }

    _onBornNewAntaraBtnClick() {
        this._bornAntaraLoader.toggle(true);
        this.$domain.bornNewAntara();
    }

}

export {
    QueenSelectorView
}