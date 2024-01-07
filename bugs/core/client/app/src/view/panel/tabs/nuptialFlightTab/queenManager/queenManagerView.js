import './style.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import queenManagerTmpl from './queenManagerTmpl.html';
import { MalesSearchView } from './malesSearch';

class QueenManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageQueen(queen) {
        this._queen = queen;

        this._renderQueen();
    }

    _render() {
        this._el.innerHTML = queenManagerTmpl;
    }

    _renderQueen() {
        this._el.querySelector('[data-queen-name]').innerHTML = this._queen.id;
        this._malesSearch = new MalesSearchView(this._el.querySelector('[data-males-search]'));
    }
}

export {
    QueenManagerView
}