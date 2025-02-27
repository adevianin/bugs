import { BaseHTMLView } from "@view/base/baseHTMLView";
import queenSelectorTmpl from './queenSelectorTmpl.html';
import { QueenProfileView } from "./queenProfileView";

class QueenSelectorView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._queens = this.$domainFacade.getMyQueensInNuptialFlight();
        this._selectedQueenIndex = null;

        this._render();

        this.$domainFacade.events.on('queenFlewNuptialFlight', this._onQueenFlewNuptialFlight.bind(this));
        // this.$domainFacade.events.on('queenFlewNuptialFlightBack', this._onQueenFlewNuptialFlightBack.bind(this));
        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));

        this._prevBtn.addEventListener('click', this._onPrevBtnClick.bind(this));
        this._nextBtn.addEventListener('click', this._onNextBtnClick.bind(this));

    }

    get queenId() {
        return this._hasSelectedQueen ? this._queens[this._selectedQueenIndex].id : null;
    }

    get _hasSelectedQueen() {
        return typeof this._selectedQueenIndex == 'number';
    }

    _render() {
        this._el.innerHTML = queenSelectorTmpl;

        this._queensEl = this._el.querySelector('[data-queens]');
        this._noQueensPlaceholderEl = this._el.querySelector('[data-no-queens-placeholder]');
        this._prevBtn = this._el.querySelector('[data-previous-btn]');
        this._nextBtn = this._el.querySelector('[data-next-btn]');

        this._queenProfileView = new QueenProfileView(this._el.querySelector('[data-queen-profile]'));

        this._renderEmptyState();
        this._renderChoosingBtnsState();

        if (this._queens.length > 0) {
            this._selectQueen(0);
        }
    }

    _renderEmptyState() {
        let isEmpty = this._queens.length == 0;
        this._noQueensPlaceholderEl.classList.toggle('g-hidden', !isEmpty);
        this._queensEl.classList.toggle('g-hidden', isEmpty);
        if (isEmpty) {
            this._selectedQueenIndex = null;
        }
    }

    _selectQueen(index) {
        this._selectedQueenIndex = index;
        let queen = this._queens[index];
        this._queenProfileView.showQueen(queen);
        this._renderChoosingBtnsState();
    }

    _renderChoosingBtnsState() {
        this._nextBtn.disabled = this._selectedQueenIndex + 1 == this._queens.length;
        this._prevBtn.disabled = this._selectedQueenIndex == 0;
    }

    _removeQueen(queen) {
        let selectedQueen = this._queens[this._selectedQueenIndex];
        let isRemovingSelectedQueen = selectedQueen.id == queen.id;
        this._queens = this._queens.filter( q => q.id != queen.id);
        if (isRemovingSelectedQueen) {
            this._selectedQueenIndex = null;
            if (this._queens.length > 0) {
                this._selectQueen(0);
            }
            this._renderEmptyState();
        } else {
            let newIndex = this._queens.indexOf(selectedQueen);
            this._selectQueen(newIndex);
        }
    }

    _onPrevBtnClick() {
        this._selectQueen(this._selectedQueenIndex - 1);
    }

    _onNextBtnClick() {
        this._selectQueen(this._selectedQueenIndex + 1);
    }

    _checkIdInQueensList(id) {
        let queensIds = this._queens.map(queen => queen.id);
        return queensIds.includes(id);
    }

    _onQueenFlewNuptialFlight(queen) {
        let isMyQueen = this.$domainFacade.isEntityMy(queen);
        if (isMyQueen) {
            this._queens.push(queen);
            this._renderEmptyState();
            if (!this._hasSelectedQueen) {
                this._selectQueen(0);
            }
            this._renderChoosingBtnsState();
        }
    }

    _onSomeoneDied(someone) {
        if (this.$domainFacade.isEntityMy(someone) && this._checkIdInQueensList(someone.id)) {
            this._removeQueen(someone);
        }
    }

}

export {
    QueenSelectorView
}