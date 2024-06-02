import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import { QueenView } from "./queenView";

class QueensListView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._queens = this.$domainFacade.getMyQueensInNuptialFlight();
        this._queenViews = {};

        this._render();

        this._stopListenQueenFlewNuptialFlight = this.$domainFacade.events.on('queenFlewNuptialFlight', this._onQueenFlewNuptialFlight.bind(this));
        this._stopListenQueenFlewNuptialFlightBack = this.$domainFacade.events.on('queenFlewNuptialFlightBack', this._onQueenFlewNuptialFlightBack.bind(this));
        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
    }

    get selectedQueen() {
        return this._selectedQueen;
    }

    remove() {
        super.remove();
        this._clearQueenViews();
        this._stopListenQueenFlewNuptialFlight();
        this._stopListenQueenFlewNuptialFlightBack();
    }

    _autoSelect() {
        let queenToSelect = this._queens.length > 0 ? this._queens[0] : null;
        this._selectQueen(queenToSelect);
    }

    _selectQueen(queen) {
        this._selectedQueen = queen;
        this._renderSelectedQueen();
        this.events.emit('selectedQueenChanged');
    }

    _render() {
        this._renderQueens();

        this._autoSelect();
    }

    _renderQueens() {
        for (let queen of this._queens) {
            this._renderQueen(queen);
        }
    }

    _renderQueen(queen) {
        let queenView = new QueenView(queen);
        queenView.events.addListener('click', () => this._onQueenViewClick(queen));
        this._queenViews[queen.id] = queenView;
        this._el.append(queenView.el);
    }

    _renderSelectedQueen() {
        let selectedQueenId = this._selectedQueen ? this._selectedQueen.id : null;
        for (let queenId in this._queenViews) {
            this._queenViews[queenId].toggleSelect(selectedQueenId == queenId);
        }
    }

    _removeQueen(queenId) {
        this._queenViews[queenId].remove();
        delete this._queenViews[queenId];
        this._queens = this._queens.filter( q => q.id != queenId);
        if (queenId == this._selectedQueen.id) {
            this._selectedQueen = null;
        }
    }

    _checkIdInQueensList(id) {
        let queensIds = this._queens.map(queen => queen.id);
        return queensIds.includes(id);
    }

    _clearQueenViews() {
        for (let queenId in this._queenViews) {
            this._queenViews[queenId].remove();
        }

        this._queenViews = {};
    }

    _onQueenFlewNuptialFlight(queen) {
        let isMyQueen = this.$domainFacade.isEntityMy(queen);
        if (isMyQueen) {
            this._queens.push(queen);
            this._renderQueen(queen);
            this._autoSelect();
        }
    }

    _onQueenFlewNuptialFlightBack(queen) {
        let isMyQueen = this.$domainFacade.isEntityMy(queen);
        if (isMyQueen) {
            this._removeQueen(queen.id);
            this._autoSelect();
        }
    }

    _onQueenViewClick(queen) {
        this._selectQueen(queen);
    }

    _onSomeoneDied(someone) {
        if (this._checkIdInQueensList(someone.id)) {
            this._removeQueen(someone.id);
            this._autoSelect();
        }
    }

}

export {
    QueensListView
}