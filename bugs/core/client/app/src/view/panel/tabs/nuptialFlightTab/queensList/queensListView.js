import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import { QueenView } from "./queenView";

class QueensListView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._queens = this.$domainFacade.getMyQueensInNuptialFlight();
        this._queenViews = {};

        this._render();

        this.$domainFacade.events.on('queenFlewNuptialFlight', this._onQueenFlewNuptialFlight.bind(this));
    }

    get selectedQueen() {
        return this._selectedQueen;
    }

    _autoSelect() {
        if (!this._selectedQueen && this._queens.length > 0) {
            this._selectQueen(this._queens[0]);
        }
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
        for (let queenId in this._queenViews) {
            this._queenViews[queenId].toggleSelect(this._selectedQueen.id == queenId);
        }
    }

    _onQueenFlewNuptialFlight(queen) {
        this._queens.push(queen);
        this._renderQueen(queen);
        this._autoSelect();
    }

    _onQueenViewClick(queen) {
        this._selectQueen(queen);
    }

}

export {
    QueensListView
}